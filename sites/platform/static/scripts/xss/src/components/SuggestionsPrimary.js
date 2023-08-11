import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import React from 'react';

// This class defines the template for primary search results,
// which in this case are documents coming from the public documentation.
// These results are presented in a separate section in the dropdown,
// and prioritized as primary results via the index's `rank` attribute.
const SuggestionsPrimary = ({ hits, title }) => {
  const results = hits.map((r) => (
    <li className="mb-4 border-b border-grey-dark" key={r.relurl}>
      <h3 className="mb-2">
        <a className="text-skye-dark hover:underline" onClick={`dataLayer.push({'event': 'click_search_result', 'click_name': ${r.title}, 'link_url': ${r.url})`} href={r.url}>
          <b dangerouslySetInnerHTML={{ __html: `${DOMPurify.sanitize(r.section)} | ` }} />
          <span dangerouslySetInnerHTML={{ __html: `${DOMPurify.sanitize(r.title)}` }} />
        </a>
      </h3>
      {/* Add keywords if they match */}
      {/* eslint-disable-next-line no-underscore-dangle */}
      {r.keywords
        && (
        <p className="mb-4">
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
      <p className="truncate mb-2" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(r._formatted.text) }} />
    </li>
  ))

  return (
    <div>
      <h2 className="text-lg font-bold mb-6">{title}</h2>
      <ul>{results}</ul>
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
