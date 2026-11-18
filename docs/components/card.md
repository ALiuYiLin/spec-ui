# Card

卡片。带边框的容器，可选标题区。

## 代码演示

:::demo 标题区可选，主体承载任意内容。

card/basic

:::
:::demo `title` 与 `extra` 分列头部两端，`content` 放正文。

card/extra

:::

## 结构

| 第 1 层 | 第 2 层 | 第 3 层 | 第 4 层 | 说明 |
|---|---|---|---|---|
| `sm-card` |  |  |  | 根 |
|  | `sm-card__header` |  |  | 可选：传入 title 或 extra |
|  |  | `sm-card__head-wrapper` |  | 可选：header 内部的一层，包住 title 与 extra |
|  |  |  | `sm-card__title` | 可选：传入 title |
|  | `sm-card__body` |  |  | 必填 |

每一列代表一层 DOM 深度；某行的类名出现在第 N 列，说明它在第 N 层（往上找最近的非空列就是它的父级）。
这张表由 `spec-tree.mjs --component=Card` 从 spec 的 `inside` 关系生成，不手工数层级。

三层嵌套是为了对齐 antd：`head` 是 `flex-column`，真正分列两端的 `flex-row` 在
`head-wrapper` 上，`title` 与 `extra` 都是它的子节点。



## 状态

| 属性 | 取值 |
|---|---|
| — | 无 |

## 不变量

- body 必须存在且只出现一次。
- header 若存在必须位于 body 之前；title 若存在必须在 head-wrapper 里。
- 圆角只在 root 上；header 不做独立圆角。

## 源码

- 协议：`spec/components/card.spec.json`
- React：`packages/react/src/card.tsx`
- Vue：`packages/vue/src/card.ts`
