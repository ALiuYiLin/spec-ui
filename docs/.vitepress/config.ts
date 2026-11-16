import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'
import tailwindcss from '@tailwindcss/vite'

const here = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  lang: 'zh-CN',
  title: 'SpecMark',
  description: 'Spec first, mark drives UI',

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
            { text: 'Radio', link: '/components/radio' },
            { text: 'Switch', link: '/components/switch' },
            { text: 'Field', link: '/components/field' },
            { text: 'InputNumber', link: '/components/input-number' },
            { text: 'Slider', link: '/components/slider' },
            { text: 'Tooltip', link: '/components/tooltip' },
            { text: 'Popover', link: '/components/popover' },
            { text: 'Modal', link: '/components/modal' },
            { text: 'Drawer', link: '/components/drawer' },
            { text: 'Dropdown', link: '/components/dropdown' },
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
