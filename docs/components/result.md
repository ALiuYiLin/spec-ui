# Result

结果页。一个状态图标加标题与副标题。

## 代码演示

::: demo
  <SmResult status="info" title="标题" subtitle="这是副标题" />
:::

## 结构

| 槽位 | 类名 | 说明 |
|---|---|---|
| 根 | `sm-result` | 必填 |
| icon | `sm-result__icon` | 必填 |
| title | `sm-result__title` | 必填 |
| subtitle | `sm-result__subtitle` | 可选 |

## 状态

| 属性 | 取值 |
|---|---|---|
| `status` | `success` `info` `warning` `error` |

## 不变量

- icon 与 title 必须存在且各出现一次，顺序为 icon → title。
- subtitle 若存在必须位于 title 之后。
- 状态只由 data-status 决定。

## 源码

- 协议：`spec/components/result.spec.json`
- React：`packages/react/src/result.tsx`
- Vue：`packages/vue/src/result.ts`
