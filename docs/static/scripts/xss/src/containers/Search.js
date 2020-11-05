import React, { Component } from 'react'
import axios from 'axios'

import Suggestions from 'components/Suggestions'
import SuggestionsPrimary from 'components/SuggestionsPrimary'

// import Config from 'platformsh-config'
// const pshConfig = require("platformsh-config").config();


// let config = {}
// const request = async () => {
//     // pshConfig = Config();
//     const response = await fetch(pshConfig.getRoute("search")["url"]);
//     const response = await fetch("search.internal");
//     config["url"] = await response.json();
//     const responseKey = await fetch(config["url"]);
//     config["public_key"] = await responseKey.json()["public"]
// }
// request();

class Search extends Component {
  state = {
    error: false,
    query: '',
    hits: { docs: [], templates: [], community: [], website: [], apidocs: [] }
  }

  getInfo = () => {
    axios.get(`${process.env.MEILI_URL}/indexes/${process.env.MEILI_INDEX}/search?attributesToCrop=text&cropLength=200&attributesToHighlight=text&q=${this.state.query}&limit=7&attributesToRetrieve=title,text,url,site,section`, { params: {}, headers: { 'X-Meili-Api-Key': process.env.MEILI_TOKEN } })
    // axios.get(`https://search.internal/indexes/docs/search?attributesToCrop=text&cropLength=200&attributesToHighlight=text&q=${this.state.query}&limit=7&attributesToRetrieve=title,text,url,site,section`, { params: {}, headers: { 'X-Meili-Api-Key': process.env.MEILI_TOKEN } })
    // axios.get(`${config["url"]}?attributesToCrop=text&cropLength=200&attributesToHighlight=text&q=${this.state.query}&limit=7&attributesToRetrieve=title,text,url,site,section`, { params: {}, headers: { 'X-Meili-Api-Key': config["public_api_key"] } })
      .then(({ data }) => {

        this.setState({
          hits: {
            docs: data.hits.filter(hit => hit.site == 'docs'),
            templates: data.hits.filter(hit => hit.site == 'templates'),
            community: data.hits.filter(hit => hit.site == 'community'),
            website: data.hits.filter(hit => hit.site == 'website'),
            apidocs: data.hits.filter(hit => hit.site == 'apidocs'),
          }
        })
      })
      .catch(() => this.setState({ error: true }))
  }

  clearInputFunc = () => {
    this.setState({
      search: ''
    })
  }

  handleInputChange = () => {
    this.setState({
      query: this.search.value
    }, () => {
      if (this.state.query && this.state.query.length > 1) {
        // this.showDropdown()
        if (this.state.query.length % 2 === 0) {
          this.getInfo()
        }
      } else if (!this.state.query) {
          this.setState({
            hits: {
              docs: [],
              templates: [],
              community: [],
              website: [],
              apidocs: [],
            }
          })
      }
    })
  }

  render() {
    const docs = this.state.hits.docs.length > 0 ? <SuggestionsPrimary title="Documentation" hits={this.state.hits.docs} /> : ''
    const templates = this.state.hits.templates.length > 0 ? <Suggestions title="Templates" hits={this.state.hits.templates} /> : ''
    const community = this.state.hits.community.length > 0 ? <Suggestions title="Community" hits={this.state.hits.community} /> : ''
    const website = this.state.hits.website.length > 0 ? <Suggestions title="Main Site" hits={this.state.hits.website} /> : ''
    const apidocs = this.state.hits.apidocs.length > 0 ? <Suggestions title="API Docs" hits={this.state.hits.apidocs} /> : ''

    const summedSecondary = this.state.hits.community.length + this.state.hits.website.length + this.state.hits.apidocs.length + this.state.hits.templates.length
    const noPrimaryResults = ( this.state.hits.docs.length == 0 && summedSecondary > 0 ) ? <div className="suggestions suggestions-primary"><h4 className="section">{"Documentation"}</h4><div className="hits"><ul>{"Sorry, no documentation matched your search."}</ul> </div> </div> : ''
    const secondaryResults = summedSecondary > 0 ? <div className="suggestions"><h4 className="section section-secondary">Other resources from Platform.sh</h4></div> : ''

    const allResults = <div className="search-all-results">{docs}{noPrimaryResults}{secondaryResults}{templates}{community}{website}{apidocs}</div>
    const noQuery = ""


    return (
      <form>

        <input
          id="searchwicon"
          placeholder="Search Platform.sh"
          ref={input => this.search = input}
          onChange={this.handleInputChange}
          className="searchinput"
        />
        <input
          type="submit"
          className="clearinput"
          value={ ( this.state.query && this.state.query.length > 1 ) ? "+" : ""}
          onClick={ this.clearInputFunc }
        />
        { ( this.state.query && this.state.query.length > 1 ) ? allResults : noQuery }
      </form>
    )
  }
}

export default Search
