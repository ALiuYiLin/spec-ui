import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@specmark/css/index.css'
import './harness.css'

// 暗色不走构建，靠 ?theme=dark 在运行时切令牌
if (new URLSearchParams(window.location.search).get('theme') === 'dark') {
  document.documentElement.dataset.theme = 'dark'
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
