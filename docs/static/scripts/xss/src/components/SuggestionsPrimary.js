import PropTypes from 'prop-types';
import React from 'react'

// This class defines the template for primary search results,
// which in this case are documents coming from the public documentation.
// These results are presented in a separate section in the dropdown,
// and prioritized as primary results via the index's `rank` attribute.
const SuggestionsPrimary = ({ hits, title }) => {
  const results = hits.map((r) => (
    <li key={r.relurl}>
      <h5>
        <a href={r.url}>
          <b>
            {r.section}
            {' '}
            |
            {' '}
          </b>
          {r.title}
        </a>
      </h5>
      {/* Add keywords if present */}
      {r.keywords
        && (
        <p>
          <strong>Keywords:</strong>
          {/* Separate the keywords by commas, except the last one */}
          {r.keywords.map((keyword, index, keywords) => `${keyword}${keywords.length - 1 > index ? ', ' : ''}`)}
        </p>
        )}
      {r.text}
    </li>
  ))
  return (
    <div className="suggestions suggestions-primary">
      <h4 className="section">{title}</h4>
      <div className="hits">
        <ul>{results}</ul>
        {' '}
      </div>
      {' '}

    </div>
  )
}

SuggestionsPrimary.propTypes = {
  hits: PropTypes.arrayOf(
    PropTypes.shape({
      keywords: PropTypes.arrayOf(PropTypes.string),
      section: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    })
  ).isRequired,
  title: PropTypes.string.isRequired
}
export default SuggestionsPrimary
