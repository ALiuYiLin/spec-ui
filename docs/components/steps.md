# Steps

步骤条。一串编号步骤，当前步骤由状态值域表达。

## 代码演示

:::demo 步骤条；当前步骤由 `data-status` 表达，`aria-current="step"` 标记位置。
  <SmSteps :current="1" :items="[{ title: '第一步' }, { title: '第二步' }]" />
:::


### 状态

:::demo `current` 之前的步骤是 `finish`，当前是 `process`，之后是 `wait`。
<div style="display: grid; gap: 24px; width: 100%">
  <SmSteps :current="0" :items="[{ title: '第一步' }, { title: '第二步' }]" />
  <SmSteps :current="1" :items="[{ title: '第一步' }, { title: '第二步' }]" />
</div>
:::

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
