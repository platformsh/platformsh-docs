import React from 'react'
import ReactDOM from 'react-dom'

import App from 'App'

if (document.getElementById('xssroot')) {
  ReactDOM.render(
    <App className="App searchbox" />,
    document.getElementById('xssroot')
  )
}

if (document.getElementById('xssSearchPage')) {
  ReactDOM.render(
    <App fullPage />,
    document.getElementById('xssSearchPage')
  )
}

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept(App)
}
