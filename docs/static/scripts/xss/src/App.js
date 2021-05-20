import React from 'react'
import styled from 'styled-components'

import Search from 'containers/Search'

const App = () => (
  <Div className="searchContainer">
    <Search />
  </Div>
)

const Div = styled.div`
  padding: 0rem;
`
export default App
