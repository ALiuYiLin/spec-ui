import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const here = import.meta.dirname

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // 直接指向源码：各包是 workspace 包，但不依赖 pnpm 链接的解析行为
      '@specmark/react': path.resolve(here, '../../packages/react/src/index.ts'),
      '@specmark/vue': path.resolve(here, '../../packages/vue/src/index.ts'),
      '@specmark/css': path.resolve(here, '../../packages/css/src'),
    },
  },
  build: {
    target: 'chrome110',
    rollupOptions: {
      input: {
        main: path.resolve(here, 'index.html'), // antd 证据台
        ref: path.resolve(here, 'ref.html'), // React 参考实现（L2 / L3）
        vue: path.resolve(here, 'vue.html'), // Vue 实现（同一套 L2 / L3）
      },
    },
  },
})
