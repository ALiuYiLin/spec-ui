import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider, theme as antdTheme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import App from './App'
import './index.css'

const isDark = new URLSearchParams(window.location.search).get('theme') === 'dark'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* motion: false 用于关掉 antd 的过渡，避免采集到动画中间态 */}
    <ConfigProvider
      locale={zhCN}
      theme={{
        // 暗色证据用 antd 自己的 darkAlgorithm，保证不是我们手调的近似值
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: { motion: false },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)
