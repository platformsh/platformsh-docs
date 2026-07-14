// Search functionality using FlexSearch.

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

// Change shortcut key to cmd+k on Mac, iPad or iPhone.
document.addEventListener("DOMContentLoaded", function () {
    if (/iPad|iPhone|Macintosh/.test(navigator.userAgent)) {
      // select the kbd element under the .search-wrapper class
      const keys = document.querySelectorAll(".search-wrapper kbd");
      keys.forEach(key => {
        key.innerHTML = '<span class="hx-text-xs">⌘</span>K';
      });
    }

    let currentQuery = getParameterByName('q');
    let form = document.getElementById('main-search');
    if (currentQuery !== null) {
        form.value = currentQuery;
        form.focus();
        // handleInputChange();
        // init()
        // search(form)
    }
    else {
        // let results = document.getElementById('results-wrapper');
        // results.classList.add("hx-hidden");
        form.focus();
    }
  });

  // Render the search data as JSON.
  // {{ $searchDataFile := printf "%s.search-data.json" .Language.Lang }}
  // {{ $searchData := resources.Get "json/search-data.json" | resources.ExecuteAsTemplate $searchDataFile . }}
  // {{ if hugo.IsProduction }}
  //   {{ $searchData := $searchData | minify | fingerprint }}
  // {{ end }}
  // {{ $noResultsFound := (T "noResultsFound") | default "No results found." }}

  (function () {

    document.addEventListener('DOMContentLoaded', function (e) {
        let currentQuery = getParameterByName('q');
        let form = document.getElementById('main-search');
        // console.log(currentQuery);
        // console.log(form);
        if (currentQuery !== null) {
            form.value = currentQuery;
            form.focus();
            preloadIndex().then(()=>{
              /**
               * search() takes an event object as its only parameter. From there it retrieves e.target.value which
               * should contain the search query we want to perform. In our case, the event passed to our callback is
               * DOMContentLoaded where the target is the whole DOM. So we'll create a fake "event" and assign the
               * necessary props (and sub props) so it can still extract the query which we determined in currentQuery
               * @todo see if there's a better way to handle this
               */
              const fake = {}
              fake.target = {value: currentQuery}
              search(fake)
            })
            // console.log("query path value");
            // handleInputChange(form);
        }
      });

    // let searchDataURL = '{{ $searchData.RelPermalink }}';
    let searchDataURL = '/search/search.json';

    const inputElements = document.querySelectorAll('.search-input');
    window.addEventListener('DOMContentLoaded', test)
    for (const el of inputElements) {
      el.addEventListener('focus', init);
      el.addEventListener('keyup', search);
    //   el.addEventListener('keydown', handleKeyDown);
    //   el.addEventListener('focus', test);
      el.addEventListener('input', handleInputChange);
    }

    const shortcutElements = document.querySelectorAll('.search-wrapper kbd');

    function setShortcutElementsOpacity(opacity) {
      shortcutElements.forEach(el => {
        el.style.opacity = opacity;
      });
    }

    function test(e) {
        init(e);
        search(e);
    }

    function handleInputChange(e) {
      const opacity = e.target.value.length > 0 ? 0 : 100;
      /**
       * If the user has cleared the results with the built-in input functionality, hide the search results
       */
      if(e.target.value.length === 0) {
        const { resultsElement } = getActiveSearchElement();
        if (!resultsElement.classList.contains('hx-hidden')) {
          hideSearchResults()
        }
        //
      }
      setShortcutElementsOpacity(opacity);
    }

    // Get the search wrapper, input, and results elements.
    function getActiveSearchElement() {
        const inputs = Array.from(document.querySelectorAll('.search-wrapper')).filter(el => el.clientHeight > 0);
        if (inputs.length === 1) {
          return {
            wrapper: inputs[0],
            inputElement: inputs[0].querySelector('.search-form').querySelector('.search-input'),
            resultsElement: document.getElementById('results-wrapper').querySelector('.search-results')
          };
        }
        return undefined;
      }

    const INPUTS = ['input', 'select', 'button', 'textarea']

    // Focus the search input when pressing ctrl+k/cmd+k or /.
    document.addEventListener('keydown', function (e) {
      const { inputElement } = getActiveSearchElement();
      if (!inputElement) return;

      const activeElement = document.activeElement;
      const tagName = activeElement && activeElement.tagName;
      if (
        inputElement === activeElement ||
        !tagName ||
        INPUTS.includes(tagName) ||
        (activeElement && activeElement.isContentEditable))
        return;

      if (
        e.key === '/' ||
        (e.key === 'k' &&
          (e.metaKey /* for Mac */ || /* for non-Mac */ e.ctrlKey))
      ) {
        e.preventDefault();
        inputElement.focus();
      } else if (e.key === 'Escape' && inputElement.value) {
        inputElement.blur();
      }
    });

    // Dismiss the search results when clicking outside the search box.
    document.addEventListener('mousedown', function (e) {
      const { inputElement, resultsElement } = getActiveSearchElement();
      if (!inputElement || !resultsElement) return;
      if (
        e.target !== inputElement &&
        e.target !== resultsElement &&
        !resultsElement.contains(e.target)
      ) {
        setShortcutElementsOpacity(100);
        // hideSearchResults();
      }
    });

    // Get the currently active result and its index.
    function getActiveResult() {
      const { resultsElement } = getActiveSearchElement();
      if (!resultsElement) return { result: undefined, index: -1 };

      const result = resultsElement.querySelector('.active');
      if (!result) return { result: undefined, index: -1 };

      const index = parseInt(result.dataset.index, 10);
      return { result, index };
    }

    // Set the active result by index.
    function setActiveResult(index) {
      const { resultsElement } = getActiveSearchElement();
      if (!resultsElement) return;

      const { result: activeResult } = getActiveResult();
      activeResult && activeResult.classList.remove('active');
      const result = resultsElement.querySelector(`[data-index="${index}"]`);
      if (result) {
        result.classList.add('active');
        result.focus();
      }
    }

    // Get the number of search results from the DOM.
    function getResultsLength() {
      const { resultsElement } = getActiveSearchElement();
      if (!resultsElement) return 0;
      return resultsElement.dataset.count;
    }

    // Finish the search by hiding the results and clearing the input.
    function finishSearch() {
      const { inputElement } = getActiveSearchElement();
      if (!inputElement) return;
      hideSearchResults();
      inputElement.value = '';
      inputElement.blur();
    }

    function hideSearchResults() {
      const { resultsElement } = getActiveSearchElement();
      if (!resultsElement) return;
      resultsElement.classList.add('hx-hidden');
    }

    // Handle keyboard events.
    function handleKeyDown(e) {
      const { inputElement } = getActiveSearchElement();
      if (!inputElement) return;

      const resultsLength = getResultsLength();
      const { result: activeResult, index: activeIndex } = getActiveResult();

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          if (activeIndex > 0) setActiveResult(activeIndex - 1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (activeIndex + 1 < resultsLength) setActiveResult(activeIndex + 1);
          break;
        case 'Enter':
          e.preventDefault();
          if (activeResult) {
            activeResult.click();
          }
          finishSearch();
        case 'Escape':
          e.preventDefault();
          hideSearchResults();
          // Clear the input when pressing escape
          inputElement.value = '';
          inputElement.dispatchEvent(new Event('input'));
          // Remove focus from the input
          inputElement.blur();
          break;
      }
    }

    // Initializes the search.
    function init(e) {
      e.target.removeEventListener('focus', init);
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
          store: ['title','full'],
          index: "content"
        }
      });

      window.sectionIndex = new FlexSearch.Document({
        tokenize,
        cache: 100,
        document: {
          id: 'id',
          store: ['title', 'content', 'url', 'display', 'full'],
          index: "content",
          tag: 'pageId'
        }
      });

      const resp = await fetch(searchDataURL);
      const data = await resp.json();
      let pageId = 0;
      for (const route in data) {
        // console.log(route)
        let pageContent = '';
        ++pageId;

        for (const heading in data[route].data) {
        //   console.log(heading)
          const [hash, text] = heading.split('#');
          const url = route.trimEnd('/') + (hash ? '#' + hash : '');
          const title = text || data[route].title;
          const full = data[route].full.trimEnd('/') + (hash ? '#' + hash : '');
          const content = data[route].data[heading] || '';
          const paragraphs = content.split('\n').filter(Boolean);

          sectionIndex.add({
            id: url,
            url,
            full,
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
              full,
              pageId: `page_${pageId}`,
              content: paragraphs[i]
            });
          }

          pageContent += ` ${title} ${content}`;
        }

        window.pageIndex.add({
          id: pageId,
          title: data[route].title,
          content: pageContent,
          full: data[route].full
        });

      }
    }

    /**
     * Performs a search based on the provided query and displays the results.
     * @param {Event} e - The event object.
     */
    function search(e) {
      let query = e.target.value;

      if (!e.target.value) {
        hideSearchResults();
        return;
      }
      //console.log("search")
      const { resultsElement } = getActiveSearchElement();
      while (resultsElement.firstChild) {
        resultsElement.removeChild(resultsElement.firstChild);
      }
      resultsElement.classList.remove('hx-hidden');

      const pageResults = window.pageIndex.search(query, 5, { enrich: true, suggest: true })[0]?.result || [];
      //console.log(JSON.stringify(pageResults))
      const results = [];
      const pageTitleMatches = {};

      for (let i = 0; i < pageResults.length; i++) {
        const result = pageResults[i];
        pageTitleMatches[i] = 0;
        //console.log("looking at page id " + i)
        //console.log(JSON.stringify(result))
        // Show the top 5 results for each page
        const sectionResults = window.sectionIndex.search(query, 5, { enrich: true, suggest: true, tag: `page_${result.id}` })[0]?.result || [];
        let isFirstItemOfPage = true
        const occurred = {}

        for (let j = 0; j < sectionResults.length; j++) {
          const { doc } = sectionResults[j]
          //console.log("looking at page counter id " + j)
          //console.log(doc)
          const isMatchingTitle = doc.display !== undefined
          if (isMatchingTitle) {
            pageTitleMatches[i]++
          }
          const { url, title, full, base } = doc
        //   console.log(doc);
          const content = doc.display || doc.content
          const myRegexp = new RegExp("^https?:\/\/([^\/]+)", "g");
          const domainMatches = myRegexp.exec(result.doc.full)
          const domain = domainMatches[1]

          let domainRank = 10

          if ('devcenter.upsun.com' === domain) {
            domainRank = 1;
          }

          if (occurred[url + '@' + content]) continue
          occurred[url + '@' + content] = true
          results.push({
            _page_rk: i,
            _section_rk: j,
            _domain_rank: domainRank,
            route: url,
            //base: base,
            prefix: isFirstItemOfPage ? result.doc.title : undefined,
            full: result.doc.full || undefined,
            //domain: domain,
            children: { title, content, full}
          })
          isFirstItemOfPage = false
        }
      }

      //console.log('pageTitleMatches:')
      //console.log(JSON.stringify(pageTitleMatches))

      const sortedResults = results
        .sort((a, b) => {
          if(a._domain_rank === b._domain_rank) {
            if (a._page_rk === b._page_rk) {
              return a._section_rk - b._section_rk
            } else {
              if (pageTitleMatches[a._page_rk] !== pageTitleMatches[b._page_rk]) {
                return pageTitleMatches[b._page_rk] - pageTitleMatches[a._page_rk]
              }
              return a._page_rk - b._page_rk
            }
          } else {
            return a._domain_rank - b._domain_rank
          }
        })
        .map(res => ({
          id: `${res._domain_rank}_${res._page_rk}_${res._section_rk}`,
          route: res.route,
          prefix: res.prefix,
          children: res.children,
          full:res.full,
          //domain: res.domain,
        }));
      //console.log('Sorted results:')
      //console.log(sortedResults)
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
        // let suggestions = document.getElementById('search-suggestions');
        // suggestions.classList.remove("hx-hidden");
        return;
      }
      // else {
      //   let suggestions = document.getElementById('search-suggestions');
      //   suggestions.classList.add("hx-hidden");
      // }

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
            <div class="post-category prefix">${result.prefix}</div>`));
        }
        const myRegexp = new RegExp("^https?:\/\/([^\/]+)", "g");
        const domainMatches = myRegexp.exec(result.children.full)
        const domain = domainMatches[1]

        let result_link = result.children.full;
        let target = "target=\"_blank\""
        if ('devcenter.upsun.com' === domain) {
          result_link = result.route;
          target = ""
        }

        let li = createElement(`
          <li class="single-search-result">
            <a data-index="${i}" href="${result_link}" ${target} class=${i === 0 ? "active" : ""} onClick="dataLayer.push({'event': 'click_search_result', 'click_name': '${result.children.title}', 'link_url': '${result.children.full}'});">
              <div class="title">`+ highlightMatches(result.children.title, query) + `</div>` +
              `<div class="result-url">${result.children.full}</div>` +
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
  })();
