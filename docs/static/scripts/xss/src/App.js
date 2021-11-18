import React from 'react'
import styled from 'styled-components'

import Search from 'containers/Search'

const App = ({fullPage}) => (
  <Div className="searchContainer">
    <Search fullPage={fullPage} />
  </Div>
)

const Div = styled.div`
  padding: 0rem;
`
export default App
