import React from 'react'
import ReactDOM from 'react-dom'
import 'styles/searchbox.css'
import { injectGlobal } from 'styled-components'

import App from 'App'

if (document.getElementById('xssroot')) {
  ReactDOM.render(
    <App className="App searchbox" />,
    document.getElementById('xssroot')
  )
}

if (document.getElementById('xssSearchPage')) {
  ReactDOM.render(
    <App fullPage={true} />,
    document.getElementById('xssSearchPage')
  )
}

if (module.hot) {
  module.hot.accept(App)
}
