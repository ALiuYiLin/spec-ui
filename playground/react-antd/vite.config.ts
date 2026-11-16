import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const here = import.meta.dirname

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // 直接指向源码：参考实现是 workspace 包，但这里不依赖 pnpm 链接的解析行为
      '@actview/react': path.resolve(here, '../../packages/av-react/src/index.ts'),
    },
  },
  build: {
    target: 'chrome110',
    rollupOptions: {
      input: {
        main: path.resolve(here, 'index.html'), // antd 证据台
        ref: path.resolve(here, 'ref.html'), // 参考实现（L2 一致性校验用）
      },
    },
  },
})
