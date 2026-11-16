import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import '@specmark/css/styles.css'
import './custom.css'
import Demo from './Demo.vue'
import ModalDemo from './ModalDemo.vue'
import DrawerDemo from './DrawerDemo.vue'
import DropdownDemo from './DropdownDemo.vue'
import * as SpecMark from '@specmark/vue'

/**
 * 组件注册表：自动注册 @specmark/vue 的所有组件。
 *
 * 之前这里手写 app.component('SmXxx', Xxx)，每加一个组件就要记得补一行——
 * 结果 C 档之后漏了 21 个，而 docs:build 仍然「成功」，页面只是渲染为空。
 * 改成从模块导出里推导，新组件不用再改这个文件。
 */
const icons = new Set(['DownIcon', 'CloseIcon', 'SpinnerIcon'])

const components = Object.entries(SpecMark).filter(
  ([name, value]) => /^[A-Z]/.test(name) && !icons.has(name) && typeof value === 'object' && value !== null,
)

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Demo', Demo)
    app.component('ModalDemo', ModalDemo)
    app.component('DrawerDemo', DrawerDemo)
    app.component('DropdownDemo', DropdownDemo)

    for (const [name, component] of components) {
      app.component(`Sm${name}`, component as never)
    }
  },
} satisfies Theme
