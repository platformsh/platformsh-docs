import React from 'react'
import renderHTML from 'react-render-html';

// This class defines the template for primary search results, which in this case are documents coming from the public 
// documentation. These results are presented in a separate section in the dropdown, and prioritized as primary results
// via the index's `rank` attribute.
const SuggestionsPrimary = (props) => {
  const results = props.hits.map(r => (
    <li key={r.url}>
      <h5> <a href={r.url}><b>{r.section}  |  </b>{r.title}</a></h5>
      {r.text}
    </li>
  ))
  return <div className="suggestions suggestions-primary"><h4 className="section">{props.title}</h4><div className="hits"><ul>{results}</ul> </div> </div>
}

export default SuggestionsPrimary
