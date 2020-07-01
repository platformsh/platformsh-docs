import React from 'react'
import renderHTML from 'react-render-html';
const ReactMarkdown = require('react-markdown');

const Suggestions = (props) => {
  const results = props.hits.map(r => (
    <li key={r.relurl}>
      <h5 className="secondary-header">{renderHTML(r.section)}</h5>
      <h5 className="secondary-link"> <a href={r.url}>{renderHTML(r.title)}</a></h5>
    </li>
  ))
  return <div className="suggestions"><div className="hits"><ul>{results}</ul></div> </div>
}

export default Suggestions
