# Breadcrumb

面包屑。一串层级链接，用分隔符连接。

## 代码演示

:::demo 用分隔符连接层级，最后一项是当前页，不再渲染分隔符。

breadcrumb/basic

:::
:::demo `items` 按顺序渲染，最后一项是当前页。

breadcrumb/items

:::

## 结构

| 槽位 | 类名 | 说明 |
|---|---|---|
| 根 | `sm-breadcrumb` | 必填，`nav`，`display: block` |
| list | `sm-breadcrumb__list` | 必填，内层 `ol`，`flex-row`，负责水平排列 |
| item | `sm-breadcrumb__item` | 至少一个，`li`，代表一级 |
| link | `sm-breadcrumb__link` | 可选，item 内的 `span`，承载文字 |
| separator | `sm-breadcrumb__separator` | 可选，`li`，最后一项不再渲染 |

为什么多一层 `ol`：antd 的根是 `block`，真正水平排列的是内层列表。
`item` / `separator` 用 `li`（computed 为 `list-item`）才能与 antd 对上，
代价是要自己压掉列表标记和宿主给的 `li` 间距。

## 状态

| 属性 | 取值 |
|---|---|---|
| — | 无 |

## 不变量

- root 必须是 nav 且带 aria-label。
- 最后一个 item 之后不得出现 separator。
- separator 必须 aria-hidden。
- 当前页（最后一项）不得是链接。

## 源码

- 协议：`spec/components/breadcrumb.spec.json`
- React：`packages/react/src/breadcrumb.tsx`
- Vue：`packages/vue/src/breadcrumb.ts`
