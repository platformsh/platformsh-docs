import React, { Component } from 'react'
import axios from 'axios'

import Suggestions from 'components/Suggestions'

let config = {}
const request = async () => {
    const response = await fetch("scripts/xss/dist/config/config.json");
    config = await response.json();
}
request();


  // public API key from
const API_URL = process.env.API_URL || '/indexes/docs/search'
// const API_URL = process.env.API_URL || '/indexes/docs/search'
// const API_URL = 'https://pr-1366-yd3epia-652soceglkw4u.eu-3.platformsh.site/indexes/docs/search'


class Search extends Component {
  state = {
    error: false,
    query: '',
    hits: { docs: [], website: [] }
  }

  getInfo = () => {
      // axios.get(`${API_URL}?api_key=${API_KEY}&prefix=${this.state.query}&limit=7`)
    axios.get(`${API_URL}?attributesToCrop=text&cropLength=200&attributesToHighlight=text&q=${this.state.query}&limit=7&attributesToRetrieve=title,text,url,site`, { params: {}, headers: { 'X-Meili-Api-Key': config["public_api_key"] } })
      .then(({ data }) => {

        this.setState({
          hits: {
            docs: data.hits.filter(hit => hit.site == 'docs'),
            website: data.hits.filter(hit => hit.site == 'website'),
          }
        })
      })
      .catch(() => this.setState({ error: true }))
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
              website: [],
            }
          })
      }
    })
  }

  render() {
    console.log(this.state);
    const docs = this.state.hits.docs.length > 0 ? <Suggestions title="Docs" hits={this.state.hits.docs} /> : ''
    const website = this.state.hits.website.length > 0 ? <Suggestions title="Main Site" hits={this.state.hits.website} /> : ''
    return (
      <form>
        <input
          placeholder="Search Platform.sh"
          ref={input => this.search = input}
          onChange={this.handleInputChange}
        />
        {docs}
        {website}
      </form>
    )
  }
}

export default Search
