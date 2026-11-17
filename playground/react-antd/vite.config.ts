import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const here = import.meta.dirname

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 直接指向源码：各包是 workspace 包，但不依赖 pnpm 链接的解析行为
      '@specmark/react': path.resolve(here, '../../packages/react/src/index.ts'),
      '@specmark/vue': path.resolve(here, '../../packages/vue/src/index.ts'),
      // CSS 是构建产物：Sass 拆分编译 + PostCSS 前缀，只暴露 dist/index.css
      '@specmark/css': path.resolve(here, '../../packages/css/dist'),
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
