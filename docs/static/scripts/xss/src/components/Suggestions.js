import PropTypes from 'prop-types';
import React from 'react'
import DOMPurify from 'dompurify';

// This class defines the template for "secondary" search results,
// which in this case are documents coming from
// api.platform.sh/docs, platform.sh, community.platform.sh, and GitHub templates.
// All secondary results are presented together in the dropdown
// below primary results from the documentation itself.
const Suggestions = ({ hits }) => {
  const results = hits.map((r) => (
    <li className="mb-4 border-b border-grey-dark" key={r.relurl}>
      <h3 className="my-2" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(r.section) }} />
      <p className="mb-4">
        <a className="text-skye-dark hover:underline" href={r.url}>
          <span dangerouslySetInnerHTML={{ __html: `${DOMPurify.sanitize(r.title)}` }} />
        </a>
      </p>
    </li>
  ))

  return (
    <div>
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
