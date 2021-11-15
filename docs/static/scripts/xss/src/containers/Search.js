import React, { useState } from 'react'
import axios from 'axios'

import Suggestions from 'components/Suggestions'
import SuggestionsPrimary from 'components/SuggestionsPrimary'

let config = {}
const request = async () => {
  // Primary configuration occurs here, which allows the Search bar in docs to communicate with the Meilisearch service.
  // The `config.json` file does not exist at build time, but is built later during the deploy hook when the `search`
  // container becomes available. Webpack isn't a fan of reading from `config-reader-nodejs` or environment variables
  // here if they are not yet set, but a file works just fine. The mount `public/scripts/xss/dist/config` has been defined
  // to support this.
  const response = await fetch("/scripts/xss/dist/config/config.json");
  config = await response.json();
}
request();

const Search = () => {
  const [query, setQuery] = useState('')
  const [hits, setHits] = useState({ docs: [], templates: [], community: [], website: [], apidocs: [] })

  const getInfo = () => {
    axios.get(`${config["url"]}indexes/${config["index"]}/search?attributesToCrop=text&cropLength=200&attributesToHighlight=text&q=${query}&limit=7&attributesToRetrieve=title,text,url,site,section`, { params: {}, headers: { 'X-Meili-Api-Key': config["public_api_key"] } })
      .then(({ data }) => {

        setHits({
          docs: data.hits.filter(hit => hit.site == 'docs'),
          templates: data.hits.filter(hit => hit.site == 'templates'),
          community: data.hits.filter(hit => hit.site == 'community'),
          website: data.hits.filter(hit => hit.site == 'website'),
          apidocs: data.hits.filter(hit => hit.site == 'apidocs'),
        })
      })
      .catch((err) => console.error(err))
  }

  const clearInputFunc = () => {
    setQuery('')
  }

  const handleInputChange = (event) => {
    setQuery(event.target.value);

    if (query && query.length > 1) {
      // this.showDropdown()
      if (query.length % 2 === 0) {
        getInfo()
      }
    } else if (!query) {
      setHits({
        docs: [],
        templates: [],
        community: [],
        website: [],
        apidocs: [],
      })
    }
  }

  const docs = hits.docs.length > 0 ? <SuggestionsPrimary title="Documentation" hits={hits.docs} /> : ''
  const templates = hits.templates.length > 0 ? <Suggestions title="Templates" hits={hits.templates} /> : ''
  const community = hits.community.length > 0 ? <Suggestions title="Community" hits={hits.community} /> : ''
  const website = hits.website.length > 0 ? <Suggestions title="Main Site" hits={hits.website} /> : ''
  const apidocs = hits.apidocs.length > 0 ? <Suggestions title="API Docs" hits={hits.apidocs} /> : ''

  const summedSecondary = hits.community.length + hits.website.length + hits.apidocs.length + hits.templates.length
  const noPrimaryResults = (hits.docs.length == 0 && summedSecondary > 0) ? <div className="suggestions suggestions-primary"><h4 className="section">{"Documentation"}</h4><div className="hits"><ul>{"Sorry, no documentation matched your search."}</ul> </div> </div> : ''
  const secondaryResults = summedSecondary > 0 ? <div className="suggestions"><h4 className="section section-secondary">Other resources from Platform.sh</h4></div> : ''

  const allResults = <div className="search-all-result">{docs}{noPrimaryResults}{secondaryResults}{templates}{community}{website}{apidocs}</div>
  const noQuery = ""


  return (
    <form>
      <label class="sr-only" for="searchwicon">Search our docs</label>
      <input
        id="searchwicon"
        placeholder="Search Platform.sh"
        onChange={handleInputChange}
        className="searchinput"
        autoComplete="off"
      />
      {query && query.length > 1 &&
        <span>
          <label class="sr-only" for="clearsearch">Clear search</label>
          <input
            id="clearsearch"
            type="submit"
            className="clearinput"
            value="+"
            onClick={clearInputFunc}
          />
        </span>}
      { (query && query.length > 1) ? allResults : noQuery}
    </form>
  )
}

export default Search
