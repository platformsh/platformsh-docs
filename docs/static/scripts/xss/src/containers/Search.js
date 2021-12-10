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
  const response = await fetch('/scripts/xss/dist/config/config.json');
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

  const urlQuery = new URLSearchParams(window.location.search).get('q');

  const limit = fullPage ? maxResults : 7

  const getInfo = (infoConfig, infoQuery) => {
    axios.get(`${infoConfig.url}indexes/${infoConfig.index}/search?attributesToCrop=text&cropLength=200&attributesToHighlight=text&q=${infoQuery}&limit=${limit}&attributesToRetrieve=title,text,url,site,section`, { params: {}, headers: { 'X-Meili-Api-Key': infoConfig.public_api_key } })
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
      if (!query) setQuery(urlQuery);
      getInfo(value, urlQuery)
    })
  }, [maxResults, setQuery, urlQuery])

  const clearInputFunc = () => {
    setQuery('')
    URLSearchParams.set('search', '')
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

  console.log(hits.docs)
  const docs = hits.docs.length > 0 ? <SuggestionsPrimary title="Documentation" hits={hits.docs} /> : ''
  const templates = hits.templates.length > 0 ? <Suggestions title="Templates" hits={hits.templates} /> : ''
  const community = hits.community.length > 0 ? <Suggestions title="Community" hits={hits.community} /> : ''
  const website = hits.website.length > 0 ? <Suggestions title="Main Site" hits={hits.website} /> : ''
  const apidocs = hits.apidocs.length > 0 ? <Suggestions title="API Docs" hits={hits.apidocs} /> : ''

  const summedSecondary = hits.community.length + hits.website.length
        + hits.apidocs.length + hits.templates.length
  const noPrimaryResults = (hits.docs.length === 0 && summedSecondary > 0) ? (
    <div className="suggestions suggestions-primary">
      <h4 className="section">Documentation</h4>
      <div className="hits">
        <ul>Sorry, no documentation matched your search.</ul>
      </div>
    </div>
  ) : ''
  const secondaryResults = summedSecondary > 0 ? <div className="suggestions"><h4 className="section section-secondary">Other resources from Platform.sh</h4></div> : ''

  const allResults = (
    <div className={fullPage ? 'search-page-results' : 'search-all-results'}>
      {docs}
      {noPrimaryResults}
      {secondaryResults}
      {templates}
      {community}
      {website}
      {apidocs}
    </div>
  )
  const noQuery = ''

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="sr-only" htmlFor="searchwicon">Search our docs</label>
        <input
          id="searchwicon"
          value={query}
          placeholder="Search Platform.sh"
          onChange={handleInputChange}
          className="searchinput"
          autoComplete="off"
        />
        {query && query.length > 1
          && (
          <button
            type="button"
            id="clearsearch"
            className="clearinput"
            onClick={clearInputFunc}
          >
            <span className="sr-only">Clear search</span>
          </button>
          )}
      </form>
      {fullPage && hits.docs.length >= (basicMaxResults - 1) && query && query.length > 1
        && (
        <button
          type="button"
          className="extraSearchResults"
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
