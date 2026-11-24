// Render the search data as JSON.
// {{ $searchDataFile := printf "%s.search-data.json" .Language.Lang }}
// {{ $searchData := resources.Get "json/search-data.json" | resources.ExecuteAsTemplate $searchDataFile . }}
// {{ if hugo.IsProduction }}
//   {{ $searchData := $searchData | minify | fingerprint }}
// {{ end }}
// {{ $noResultsFound := (T "noResultsFound") | default "No results found." }}


document.getElementById('main-search')
    .addEventListener('keyup', function(event) {
        if (event.code === 'Enter')
        {
            event.preventDefault();
            document.querySelector('form').submit();
        }
    });

function getParameterByName(name, url = window.location.href) {
      name = name.replace(/[\[\]]/g, '\\$&');
      var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function getActiveSearchElement() {
      const inputs = Array.from(document.querySelectorAll('.search-wrapper')).filter(el => el.clientHeight > 0);
    //   console.log(inputs.length)
      if (inputs.length === 1) {
        // console.log(inputs[0]);
        // console.log(inputs[0].querySelector('.search-form').querySelector('.search-input'));
        // console.log(document.getElementById('results-wrapper').querySelector('.search-results'));
        return {
          wrapper: inputs[0],
          inputElement: inputs[0].querySelector('.search-form').querySelector('.search-input'),
          resultsElement: document.getElementById('results-wrapper').querySelector('.search-results')
        //   inputElement: document.getElementById('main-search'),
        //   resultsElement: inputs[0].querySelector('.search-results')
        };
      }
      return undefined;
    }

function getActiveResult() {
    const { resultsElement } = getActiveSearchElement();
    if (!resultsElement) return { result: undefined, index: -1 };

    const result = resultsElement.querySelector('.active');
    if (!result) return { result: undefined, index: -1 };

    const index = parseInt(result.dataset.index, 10);
    return { result, index };
}
  
/**
 * Performs a search based on the provided query and displays the results.
 * @param {Event} e - The event object.
 */
function search(e) {
  const query = e
  // if (!e.target.value) {
  //   hideSearchResults();
  //   return;
  // }
  console.log(query);
  const { resultsElement } = getActiveSearchElement();
  console.log(resultsElement);
  // while (resultsElement.firstChild) {
  //   resultsElement.removeChild(resultsElement.firstChild);
  // }
  // resultsElement.classList.remove('hx-hidden');
  console.log(window.pageIndex.search("discord"))
  const pageResults = window.pageIndex.search(query, 5, { enrich: true, suggest: true })[0]?.result || [];
  console.log(pageResults);

  const results = [];
  const pageTitleMatches = {};

  for (let i = 0; i < pageResults.length; i++) {
    const result = pageResults[i];
    pageTitleMatches[i] = 0;

    // Show the top 5 results for each page
    const sectionResults = window.sectionIndex.search(query, 5, { enrich: true, suggest: true, tag: `page_${result.id}` })[0]?.result || [];
    let isFirstItemOfPage = true
    const occurred = {}

    for (let j = 0; j < sectionResults.length; j++) {
      const { doc } = sectionResults[j]
      const isMatchingTitle = doc.display !== undefined
      if (isMatchingTitle) {
        pageTitleMatches[i]++
      }
      const { url, title } = doc
      const content = doc.display || doc.content

      if (occurred[url + '@' + content]) continue
      occurred[url + '@' + content] = true
      results.push({
        _page_rk: i,
        _section_rk: j,
        route: url,
        prefix: isFirstItemOfPage ? result.doc.title : undefined,
        children: { title, content }
      })
      isFirstItemOfPage = false
    }
  }
  const sortedResults = results
    .sort((a, b) => {
      // Sort by number of matches in the title.
      if (a._page_rk === b._page_rk) {
        return a._section_rk - b._section_rk
      }
      if (pageTitleMatches[a._page_rk] !== pageTitleMatches[b._page_rk]) {
        return pageTitleMatches[b._page_rk] - pageTitleMatches[a._page_rk]
      }
      return a._page_rk - b._page_rk
    })
    .map(res => ({
      id: `${res._page_rk}_${res._section_rk}`,
      route: res.route,
      prefix: res.prefix,
      children: res.children
    }));
  console.log(sortedResults);
  displayResults(sortedResults, query);
}
  
/**
 * Displays the search results on the page.
 *
 * @param {Array} results - The array of search results.
 * @param {string} query - The search query.
 */
function displayResults(results, query) {
  const { resultsElement } = getActiveSearchElement();
  if (!resultsElement) return;

  if (!results.length) {
    resultsElement.innerHTML = `<span class="no-result">{{ $noResultsFound | safeHTML }}</span>`;
    return;
  }

  // Highlight the query in the result text.
  function highlightMatches(text, query) {
    const escapedQuery = query.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(escapedQuery, 'gi');
    return text.replace(regex, (match) => `<span class="match">${match}</span>`);
  }

  // Create a DOM element from the HTML string.
  function createElement(str) {
    const div = document.createElement('div');
    div.innerHTML = str.trim();
    return div.firstChild;
  }

  function handleMouseMove(e) {
    const target = e.target.closest('a');
    if (target) {
      const active = resultsElement.querySelector('a.active');
      if (active) {
        active.classList.remove('active');
      }
      target.classList.add('active');
    }
  }

  const fragment = document.createDocumentFragment();
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result.prefix) {
      fragment.appendChild(createElement(`
        <div class="prefix">${result.prefix}</div>`));
    }
    let li = createElement(`
      <li>
        <a data-index="${i}" href="${result.route}" class=${i === 0 ? "active" : ""}>
          <div class="title">`+ highlightMatches(result.children.title, query) + `</div>` +
      (result.children.content ?
        `<div class="excerpt">` + highlightMatches(result.children.content, query) + `</div>` : '') + `
        </a>
      </li>`);
    li.addEventListener('mousemove', handleMouseMove);
    li.addEventListener('keydown', handleKeyDown);
    li.querySelector('a').addEventListener('click', finishSearch);
    fragment.appendChild(li);
  }
  resultsElement.appendChild(fragment);
  resultsElement.dataset.count = results.length;
}

// Initializes the search.
function init() {
  // e.target.removeEventListener('focus', init);
  if (!(window.pageIndex && window.sectionIndex)) {
    preloadIndex();
  }
}

/**
 * Preloads the search index by fetching data and adding it to the FlexSearch index.
 * @returns {Promise<void>} A promise that resolves when the index is preloaded.
 */
async function preloadIndex() {
  const tokenize = '{{- site.Params.search.flexsearch.tokenize | default  "forward" -}}';
  window.pageIndex = new FlexSearch.Document({
    tokenize,
    cache: 100,
    document: {
      id: 'id',
      store: ['title'],
      index: "content"
    }
  });
  console.log(pageIndex);
  window.sectionIndex = new FlexSearch.Document({
    tokenize,
    cache: 100,
    document: {
      id: 'id',
      store: ['title', 'content', 'url', 'display'],
      index: "content",
      tag: 'pageId'
    }
  });
  const searchDataURL = '{{ $searchData.RelPermalink }}';
  const resp = await fetch(searchDataURL);
  const data = await resp.json();
  console.log(data)
  let pageId = 0;
  for (const route in data) {
    // console.log(route);
    let pageContent = '';
    ++pageId;

    for (const heading in data[route].data) {
      const [hash, text] = heading.split('#');
      const url = route.trimEnd('/') + (hash ? '#' + hash : '');
      const title = text || data[route].title;

      const content = data[route].data[heading] || '';
      const paragraphs = content.split('\n').filter(Boolean);

      sectionIndex.add({
        id: url,
        url,
        title,
        pageId: `page_${pageId}`,
        content: title,
        ...(paragraphs[0] && { display: paragraphs[0] })
      });

      for (let i = 0; i < paragraphs.length; i++) {
        sectionIndex.add({
          id: `${url}_${i}`,
          url,
          title,
          pageId: `page_${pageId}`,
          content: paragraphs[i]
        });
      }

      pageContent += ` ${title} ${content}`;
    }

    window.pageIndex.add({
      id: pageId,
      title: data[route].title,
      content: pageContent
    });
  }
  console.log(window.pageIndex);
}    

(() => {
    'use strict';
    window.addEventListener('DOMContentLoaded', () => {
        let currentQuery = getParameterByName('q');
        let form = document.getElementById('main-search');
        if (currentQuery !== null) {
            form.value = currentQuery;
            // let landing = document.getElementById('search-landing');
            // landing.classList.add("hx-hidden");
            // let suggestions = document.getElementById('search-suggestions');
            // suggestions.classList.add("hx-hidden");

            form.focus();

            // console.log(currentQuery);

            // const searchDataURL = '{{ $searchData.RelPermalink }}';
            // console.log(searchDataURL);

            // init();
            // search(currentQuery);

            // search


        } else {
            let results = document.getElementById('results-wrapper');
            results.classList.add("hx-hidden");
            form.focus();
        }
    });
})();

