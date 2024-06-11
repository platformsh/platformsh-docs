import axios from 'axios'
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react'
import regeneratorRuntime from 'regenerator-runtime'; // eslint-disable-line no-unused-vars

import Suggestions from 'components/Suggestions'
import SuggestionsPrimary from 'components/SuggestionsPrimary'

const getConfig = async () => {
  // Primary configuration occurs here,
  // which allows the Search bar in docs to communicate with the Meilisearch service.
  // The `config.json` file does not exist at build time,
  // but is built later during the deploy hook when the `search` container becomes available.
  // Webpack isn't a fan of reading from `config-reader-nodejs` or environment variables
  // here if they are not yet set, but a file works just fine.
  // The mount `public/scripts/xss/dist/config` has been defined to support this.
  const response = await fetch(`/scripts/xss/dist/config/config.json?version=${Date.now().toString()}`);
  return response.json();
}

const Search = ({ fullPage }) => {
  const basicMaxResults = 7
  const [query, setQuery] = useState('')
  const [hits, setHits] = useState({
    docs: [], templates: [], community: [], website: [], apidocs: []
  })
  const [maxResults, setMaxResults] = useState(basicMaxResults)
  const [config, setConfig] = useState({
    index: '',
    public_api_key: '',
    url: ''
  })

  let urlQuery = fullPage ? new URLSearchParams(window.location.search).get('q') : '';

  // If it's the 404 page, check the URL to prepopulate the search
  if (fullPage && document.querySelector('[data-page="404"]')) {
    const url = new URL(window.location.href)
    urlQuery = url.pathname.replace('.html', '').replaceAll('/', ' ').replaceAll('-', ' ')
  }

  const limit = fullPage ? maxResults : 7

  const getInfo = (infoConfig, infoQuery) => {
    axios.get(`${infoConfig.url}indexes/${infoConfig.index}/search?attributesToCrop=text&cropLength=200&attributesToHighlight=text,keywords&q=${infoQuery}&limit=${limit}&attributesToRetrieve=title,keywords,text,url,site,section`, { params: {}, headers: { Authorization: `Bearer ${infoConfig.public_api_key}` } })
      .then(({ data }) => {
        setHits({
          docs: data.hits.filter((hit) => hit.site === 'docs'),
          templates: data.hits.filter((hit) => hit.site === 'templates'),
          community: data.hits.filter((hit) => hit.site === 'community'),
          website: data.hits.filter((hit) => hit.site === 'website'),
          apidocs: data.hits.filter((hit) => hit.site === 'apidocs'),
        })
      })
      .catch((err) => console.error(err))
  }

  useEffect(() => {
    getConfig().then((value) => {
      setConfig(value)
      if (!query) {
        setQuery(urlQuery)
        getInfo(value, urlQuery)
      } else {
        getInfo(value, query)
      }
    })
  }, [maxResults, urlQuery])

  const clearInputFunc = () => {
    setQuery('')
  }

  const handleInputChange = (event) => {
    const { value } = event.target
    setQuery(value);
    getInfo(config, value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!fullPage) {
      window.location = `${window.location.origin}/search.html?q=${query}`
    }
  }

  const docs = hits.docs.length > 0 ? <SuggestionsPrimary title="Documentation" hits={hits.docs} /> : ''
  const templates = hits.templates.length > 0 ? <Suggestions title="Templates" hits={hits.templates} /> : ''
  const community = hits.community.length > 0 ? <Suggestions title="Community" hits={hits.community} /> : ''
  const website = hits.website.length > 0 ? <Suggestions title="Main Site" hits={hits.website} /> : ''
  const apidocs = hits.apidocs.length > 0 ? <Suggestions title="API Docs" hits={hits.apidocs} /> : ''

  const summedSecondary = hits.community.length + hits.website.length
    + hits.apidocs.length + hits.templates.length
  const noPrimaryResults = (hits.docs.length === 0 && summedSecondary > 0) ? (
    <div>
      <h2 className="text-lg font-bold">Documentation</h2>
      <p>No documentation matched your search, but you can try the other resources below.</p>
    </div>
  ) : ''
  const noResults = (hits.docs.length === 0 && summedSecondary === 0) ? (
    <div>
      <h2 className="text-lg font-bold">No results</h2>
      <p>No documentation matched your search.</p>
    </div>
  ) : ''
  const secondaryResults = summedSecondary > 0 ? <h2 className="text-lg font-bold mb-4">Other resources from Platform.sh</h2> : ''

  const allResults = (
    <div className={`${fullPage ? 'w-[94vw] md:w-full md:max-w-4xl 2xl:max-w-6xl ' : 'absolute max-h-[75vh] overflow-y-auto z-10 mb-4'} bg-grey p-6 w-full text-ebony`}>
      {noResults}
      {docs}
      {noPrimaryResults}
      <div className={`bg-white -mx-6 -mb-6 p-6 ${(noResults || noPrimaryResults) && 'hidden'}`}>
        {secondaryResults}
        {templates}
        {community}
        {website}
        {apidocs}
      </div>
    </div>
  )
  const noQuery = ''

  return (
    <>
      <form onSubmit={handleSubmit} className={`${fullPage ? 'max-w-4xl bg-grey mb-4' : ''}`}>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="sr-only" htmlFor={`searchwicon-${fullPage ? 'fullpage' : 'header'}`}>Search our docs</label>
        <div className="flex items-center">
          <input
            id={`searchwicon-${fullPage ? 'fullpage' : 'header'}`}
            value={query}
            placeholder="What are you looking for?"
            onChange={handleInputChange}
            className={`bg-no-repeat bg-[length:15px_15px] bg-left-4 h-16 w-full pl-12 text-slate border-none focus-visible:outline-none ${fullPage ? 'bg-grey' : ''}`}
            style={{ 'background-image': 'url(/images/svg/search-solid.svg)' }}
            autoComplete="off"
          />
          {query && query.length > 1
            && (
              <button
                type="button"
                id="clearsearch"
                className={`p-4 hover:bg-${fullPage ? 'white' : 'grey'}`}
                onClick={clearInputFunc}
              >
                <img src="/images/icons/close.svg" alt="Clear search" />
              </button>
            )}
        </div>
      </form>
      {fullPage && hits.docs.length >= (basicMaxResults - 1) && query && query.length > 1
        && (
          <button
            type="button"
            className="py-2 px-4 mb-2 border-2 border-ebony font-bold text-ebony hover:text-snow hover:bg-ebony"
            onClick={() => {
              if (maxResults === basicMaxResults) setMaxResults(200)
              else setMaxResults(basicMaxResults)
            }}
          >
            {maxResults === basicMaxResults ? 'Show all results' : 'Hide extra results'}
          </button>
        )}
      {(query && query.length > 1) ? allResults : noQuery}
    </>
  )
}

Search.propTypes = {
  fullPage: PropTypes.bool,
}
Search.defaultProps = {
  fullPage: false,
}

export default Search
