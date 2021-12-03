import React from 'react'
import ReactDOM from 'react-dom'
import 'styles/searchbox.css'

import App from 'App'

ReactDOM.render(
  <App className="App searchbox" />,
  document.getElementById('xssroot')
)

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept(App)
}
