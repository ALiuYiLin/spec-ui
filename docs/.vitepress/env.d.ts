/// <reference types="vite/client" />

/**
 * `.vitepress` 自己的类型声明。
 *
 * vite/client 提供 `import.meta.glob` 的类型（示例组件注册要用），
 * 以及 `*.css` 这类副作用导入的声明。vite 现在是根依赖，可以正常解析。
 */

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}

/** markdown-it-container 自身不带类型声明 */
declare module 'markdown-it-container' {
  const plugin: unknown
  export default plugin
}
