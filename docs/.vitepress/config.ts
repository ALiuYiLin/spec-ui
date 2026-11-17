import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'
import demoPlugin from './plugins/demo'

const here = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  lang: 'zh-CN',
  title: 'SpecMark',
  description: 'Spec first, mark drives UI',

  head: [
    [
      'script',
      {},
      // VitePress 用 <html class="dark"> 表达暗色，组件库用 <html data-theme="dark">。
      // 这里把类名镜像成属性：
      //  - 同步执行一次，覆盖「首屏就是暗色」的情况
      //  - MutationObserver 覆盖运行期切换（右上角主题开关只改 class，不刷新页面）
      // 放在 head 里执行，且观察者在同一轮任务内回调，因此不会出现亮色闪一下。
      [
        '(function () {',
        '  var root = document.documentElement;',
        '  function sync() {',
        "    root.dataset.theme = root.classList.contains('dark') ? 'dark' : 'light';",
        '  }',
        '  sync();',
        "  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['class'] });",
        '})();',
      ].join('\n'),
    ],
  ],

  // ::: demo 容器：构建期把示例源码高亮好再交给 Demo 组件
  markdown: {
    config: (md) => {
      md.use(demoPlugin)
    },
  },

  themeConfig: {    nav: [
      { text: '指南', link: '/guide/protocol' },
      { text: '组件', link: '/components/button' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [{ text: '协议分层', link: '/guide/protocol' },
          { text: '主题与暗色', link: '/guide/theme' }],
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
            { text: 'Divider', link: '/components/divider' },
            { text: 'Tag', link: '/components/tag' },
            { text: 'Avatar', link: '/components/avatar' },
            { text: 'Badge', link: '/components/badge' },
            { text: 'Space', link: '/components/space' },
            { text: 'Card', link: '/components/card' },
            { text: 'Alert', link: '/components/alert' },
            { text: 'Spin', link: '/components/spin' },
            { text: 'Empty', link: '/components/empty' },
            { text: 'Progress', link: '/components/progress' },
            { text: 'Skeleton', link: '/components/skeleton' },
            { text: 'Result', link: '/components/result' },
            { text: 'Statistic', link: '/components/statistic' },
            { text: 'Breadcrumb', link: '/components/breadcrumb' },
            { text: 'Image', link: '/components/image' },
            { text: 'Steps', link: '/components/steps' },
            { text: 'Timeline', link: '/components/timeline' },
            { text: 'Descriptions', link: '/components/descriptions' },
          ],
        },
      ],
    },
    outline: { level: [2, 3] },
    docFooter: { prev: '上一页', next: '下一页' },
  },

  vite: {

    resolve: {
      alias: {
        '@specmark/vue': path.resolve(here, '../../packages/vue/src/index.ts'),
        '@specmark/css': path.resolve(here, '../../packages/css/dist'),
      },
    },
  },
})
