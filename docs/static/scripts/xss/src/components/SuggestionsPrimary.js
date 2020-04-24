import React from 'react'
import renderHTML from 'react-render-html';

const SuggestionsPrimary = (props) => {
  const results = props.hits.map(r => (
    <li key={r.url}>
      <h5> <a href={r.url}><b>{r.section}  |  </b>{r.title}</a></h5>
      {r._formatted ? renderHTML(r._formatted.text) : r.text}
    </li>
  ))
  return <div className="suggestions suggestions-primary"><h4 className="section">{props.title}</h4><div className="hits"><ul>{results}</ul> </div> </div>
}

export default SuggestionsPrimary
