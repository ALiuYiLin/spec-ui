/**
 * `.vitepress` 自己的类型声明。
 *
 * 这里不引 `vite/client`：vite 不是根依赖，从 docs 目录不一定解析得到。
 * 只声明文档站真正用到的两类模块——CSS 副作用导入与 SFC。
 */

declare module '*.css'

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
