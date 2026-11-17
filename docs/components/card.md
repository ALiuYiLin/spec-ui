# Card

卡片。带边框的容器，可选标题区。

## 代码演示

:::demo 标题区可选，主体承载任意内容。

card/basic

:::
## 结构

| 槽位 | 类名 | 说明 |
|---|---|---|
| 根 | `sm-card` | 必填 |
| header | `sm-card__header` | 可选 |
| title | `sm-card__title` | 可选 |
| body | `sm-card__body` | 必填 |

## 状态

| 属性 | 取值 |
|---|---|
| — | 无 |

## 不变量

- body 必须存在且只出现一次。
- header 若存在必须位于 body 之前；title 若存在必须是 header 的直接子节点。
- 圆角只在 root 上；header 不做独立圆角。

## 源码

- 协议：`spec/components/card.spec.json`
- React：`packages/react/src/card.tsx`
- Vue：`packages/vue/src/card.ts`
