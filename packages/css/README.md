# @specmark/css

SpecMark 的样式层。只依赖协议 DOM（`sm-*` 类名与 `data-*`），不依赖任何框架实现。

## 目录

```
src/
  index.scss              入口，只做组装（@use 顺序 = 输出顺序）
  _tokens.scss            设计令牌（:root 变量），不含规则
  components/
    button.scss           每个组件一个文件，与 spec/components/button.spec.json 一一对应
    select.scss
    ...
scripts/build.mjs         Sass 编译 + PostCSS 处理，产出 dist/index.css
dist/index.css            构建产物（gitignored），包对外的唯一入口
```

## 命令

```bash
pnpm --filter @specmark/css run build     # 产出 dist/index.css
```

`pnpm verify` 与 `playground` 的 `build` 都会自动先跑这一步。

## 构建链

```
src/index.scss ──sass──► 单份 CSS ──postcss(autoprefixer)──► dist/index.css
```

- **Sass** 只用来拆分文件与提供变量；输出保持扁平选择器，不做嵌套
- **PostCSS** 目前只挂 autoprefixer，不加其它转换
- 不用任何 CSS 框架的运行时：`@apply` 已在拆分时展开成等价声明

## 加一个组件的样式

1. 新建 `src/components/<kebab>.scss`，只写本组件的规则
2. 在 `src/index.scss` 末尾加一行 `@use 'components/<kebab>';`
3. 跑 `pnpm --filter @specmark/css run build`

## 三条硬约束

| 约束 | 原因 |
|---|---|
| 所有 `sm-*` 元素显式 `box-sizing: border-box` | 不加载 preflight，浏览器默认 content-box |
| 组件规则不放进 `@layer` | 宿主（VitePress 等）的无层级样式会压过任何层 |
| 不写 `:where()` 权重为 0 的选择器 | 组件样式需要能覆盖宿主的默认样式 |

详见 `spec/CONVENTIONS.md`。
