# Timeline

时间轴。一个圆点、一条竖线、一段内容。

## 代码演示

:::demo 每个节点由圆点与内容组成，竖线用伪元素绘制。
  <SmTimeline :items="[{ content: '创建于 09:00' }, { content: '更新于 10:30' }]" />
:::

## 结构

| 槽位 | 类名 | 说明 |
|---|---|---|
| 根 | `sm-timeline` | 必填 |
| item | `sm-timeline__item` | 必填 |
| dot | `sm-timeline__dot` | 必填 |
| content | `sm-timeline__content` | 必填 |

## 状态

| 属性 | 取值 |
|---|---|---|
| — | 无 |

## 不变量

- item 必须是 root 的直接子节点；dot 与 content 必须是 item 的直接子节点。
- dot 必须 aria-hidden。
- 竖线用伪元素绘制，不占 DOM。

## 源码

- 协议：`spec/components/timeline.spec.json`
- React：`packages/react/src/timeline.tsx`
- Vue：`packages/vue/src/timeline.ts`
