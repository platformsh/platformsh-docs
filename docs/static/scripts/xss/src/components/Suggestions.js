import React from 'react'
import renderHTML from 'react-render-html';
const ReactMarkdown = require('react-markdown');


// This class defines the template for "secondary"search results, which in this case are documents coming from 
// api.platform.sh/docs, platform.sh, community.platform.sh, and GitHub templates. All secondary results are presented
// together in the dropdown below primary results from the documentation itself.
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
