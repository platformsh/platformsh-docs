import React from 'react'
import ReactDOM from 'react-dom'
import 'styles/searchbox.css'
import { injectGlobal } from 'styled-components'

import App from 'App'

ReactDOM.render(
  <App className="App searchbox" />,
  document.getElementById('xssroot')
)

if (module.hot) {
  module.hot.accept(App)
}
