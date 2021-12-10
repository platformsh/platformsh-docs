import PropTypes from 'prop-types';
import React from 'react'
import styled from 'styled-components'

import Search from 'containers/Search'

const App = ({ fullPage = false }) => (
  <Div className="searchContainer">
    <Search fullPage={fullPage} />
  </Div>
)

App.propTypes = {
  fullPage: PropTypes.bool,
}
App.defaultProps = {
  fullPage: false,
}

const Div = styled.div`
  padding: 0rem;
`
export default App
