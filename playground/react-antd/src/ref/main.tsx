import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@specmark/css/index.css'
import './harness.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
