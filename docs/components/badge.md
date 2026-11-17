# Badge

徽标数。包裹一个元素，在右上角叠加计数或小圆点。

## 代码演示

::: demo
  <SmBadge :count="5">
    <span style="display: inline-block; width: 40px; height: 40px; background: #ddd"></span>
  </SmBadge>
  <SmBadge :count="120" :overflow-count="99">
    <span style="display: inline-block; width: 40px; height: 40px; background: #ddd"></span>
  </SmBadge>
:::

## 结构

| 槽位 | 类名 | 说明 |
|---|---|---|
| 根 | `sm-badge` | 包裹被装饰内容 |
| 计数 | `sm-badge__count` | 可选，`<sup>`，绝对定位于右上角 |

## 状态

| 属性 | 取值 |
|---|---|
| `data-dot` | 布尔，只显示小圆点 |
| `data-status` | `default` `success` `warning` `error` |

## 视觉基线

| 项 | 值 |
|---|---|
| 计数 | 高 20、最小宽 20、圆角 10 |
| 底色 | `#FF4D4F`，白字 12/20 |
| 描边 | `0 0 0 1px #fff`（与背景分离） |
| 位移 | `translate(50%, -50%)` |
| 溢出 | `hidden`，且不设内边距 |

计数的内边距是 0，靠 `min-width` + 居中撑开——加内边距会让两位数的徽标明显偏宽。

## 源码

- 协议：`spec/components/badge.spec.json`
- React：`packages/react/src/badge.tsx`
- Vue：`packages/vue/src/badge.ts`
