import PropTypes from 'prop-types';
import React from 'react'
import DOMPurify from 'dompurify';

// This class defines the template for "secondary"search results,
// which in this case are documents coming from
// api.platform.sh/docs, platform.sh, community.platform.sh, and GitHub templates.
// All secondary results are presentedtogether in the dropdown
// below primary results from the documentation itself.
const Suggestions = ({ hits }) => {
  const results = hits.map((r) => (
    <li key={r.relurl}>
      <h5 className="secondary-header" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(r.section) }} />
      <h5 className="secondary-link">
        <a href={r.url}>{r.title}</a>
      </h5>
    </li>
  ))
  return (
    <div className="suggestions">
      <div className="hits"><ul>{results}</ul></div>
      {' '}
    </div>
  )
}

Suggestions.propTypes = {
  hits: PropTypes.arrayOf(
    PropTypes.shape({
      section: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })
  ).isRequired
}

export default Suggestions
