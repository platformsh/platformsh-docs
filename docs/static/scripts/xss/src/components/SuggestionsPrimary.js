import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import React from 'react';

// This class defines the template for primary search results,
// which in this case are documents coming from the public documentation.
// These results are presented in a separate section in the dropdown,
// and prioritized as primary results via the index's `rank` attribute.
const SuggestionsPrimary = ({ hits, title }) => {
  const results = hits.map((r) => (
    <li key={r.relurl}>
      <h5>
        <a href={r.url}>
          <b dangerouslySetInnerHTML={{ __html: `${DOMPurify.sanitize(r.section)} | ` }} />
          <span dangerouslySetInnerHTML={{ __html: `${DOMPurify.sanitize(r.title)}` }} />
        </a>
      </h5>
      {/* Add keywords if they match */}
      {/* eslint-disable-next-line no-underscore-dangle */}
      {r._matchesInfo.keywords
        && (
        <p>
          Keywords:
          {' '}
          {/* eslint-disable-next-line no-underscore-dangle */}
          {r._formatted.keywords.map((keyword, index, keywords) => {
            /* Sanitize and separate the keywords by commas, except the last one */
            const sanitizedKeyword = `${DOMPurify.sanitize(keyword)}${keywords.length - 1 > index ? ', ' : ''}`
            /* eslint-disable-next-line react/no-danger */
            return <span dangerouslySetInnerHTML={{ __html: sanitizedKeyword }} />
          })}
        </p>
        )}
      {/* eslint-disable-next-line no-underscore-dangle, react/no-danger */}
      <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(r._formatted.text) }} />
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
