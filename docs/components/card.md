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

| 槽位 | 类名 | 说明 |
|---|---|---|
| 根 | `sm-card` | 必填 |
| header | `sm-card__header` | 可选 |
| head-wrapper | `sm-card__head-wrapper` | 可选，header 内部的一层 |
| title | `sm-card__title` | 可选，在 head-wrapper 里 |
| body | `sm-card__body` | 必填 |

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
