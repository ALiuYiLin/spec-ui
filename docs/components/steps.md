# Steps

步骤条。一串编号步骤，当前步骤由状态值域表达。

## 结构

| 槽位 | 类名 | 说明 |
|---|---|---|
| 根 | `sm-steps` | 必填 |
| item | `sm-steps__item` | 必填 |
| title | `sm-steps__title` | 必填 |

## 状态

| 属性 | 取值 |
|---|---|---|
| `direction` | `horizontal` `vertical` |

## 不变量

- item 必须是 root 的直接子节点；title 必须是 item 的直接子节点。
- 当前步骤必须恰好有一个 item 带 data-status="process"。
- 已完成步骤带 data-status="finish"，未开始为 wait。

## 源码

- 协议：`spec/components/steps.spec.json`
- React：`packages/react/src/steps.tsx`
- Vue：`packages/vue/src/steps.ts`
