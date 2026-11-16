import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* motion: false 用于关掉 antd 的过渡，避免采集到动画中间态 */}
    <ConfigProvider locale={zhCN} theme={{ token: { motion: false } }}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)
