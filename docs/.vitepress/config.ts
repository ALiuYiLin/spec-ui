import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'
import tailwindcss from '@tailwindcss/vite'

const here = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  lang: 'zh-CN',
  title: 'SpecMark',
  description: '框架无关的组件协议：一份 DOM 契约，多套实现，一套样式',

  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/protocol' },
      { text: '组件', link: '/components/button' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [{ text: '协议分层', link: '/guide/protocol' }],
        },
      ],
      '/components/': [
        {
          text: '组件',
          items: [
            { text: 'Button', link: '/components/button' },
            { text: 'Select', link: '/components/select' },
            { text: 'Input', link: '/components/input' },
            { text: 'Checkbox', link: '/components/checkbox' },
          ],
        },
      ],
    },
    outline: { level: [2, 3] },
    docFooter: { prev: '上一页', next: '下一页' },
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@specmark/vue': path.resolve(here, '../../packages/vue/src/index.ts'),
        '@specmark/css': path.resolve(here, '../../packages/css/src'),
      },
    },
  },
})
