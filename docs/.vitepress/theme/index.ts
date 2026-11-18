import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import '@specmark/css/index.css'
import './custom.css'
import Demo from './Demo.vue'
import ModalDemo from './ModalDemo.vue'
import DrawerDemo from './DrawerDemo.vue'
import DropdownDemo from './DropdownDemo.vue'
import IconDemo from './IconDemo.vue'

const pascal = (value: string) =>
  value
    .split(/[-_/]/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('')

/**
 * 示例注册表：docs/examples/**\/*.vue 全部注册成 `Example<路径>` 组件。
 *
 * 与 demo 容器插件共用同一套命名规则（button/demo-1 → ExampleButtonDemo1），
 * 所以容器里只要写一行相对路径，示例就以真实 .vue 文件存在，而不是内联在 markdown 里。
 */
const exampleModules = import.meta.glob('../../examples/**/*.vue', { eager: true }) as Record<
  string,
  { default: unknown }
>

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Demo', Demo)
    app.component('ModalDemo', ModalDemo)
    app.component('DrawerDemo', DrawerDemo)
    app.component('DropdownDemo', DropdownDemo)
    app.component('IconDemo', IconDemo)

    for (const [file, mod] of Object.entries(exampleModules)) {
      const relative = file.replace(/^.*\/examples\//, '').replace(/\.vue$/, '')
      app.component(`Example${pascal(relative)}`, mod.default as never)
    }
  },
} satisfies Theme
