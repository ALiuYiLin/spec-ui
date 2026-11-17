# Descriptions

描述列表。一组成对的「标签 / 内容」。

## 代码演示

<Demo>
  <SmDescriptions :items="[{ label: '姓名', content: '张三' }, { label: '部门', content: '设计' }]" />
</Demo>

## 结构

| 槽位 | 类名 | 说明 |
|---|---|---|
| 根 | `sm-descriptions` | 必填 |
| item | `sm-descriptions__item` | 必填 |
| label | `sm-descriptions__label` | 必填 |
| content | `sm-descriptions__content` | 必填 |

## 状态

| 属性 | 取值 |
|---|---|---|
| — | 无 |

## 不变量

- item 必须是 root 的直接子节点；label 与 content 必须是 item 的直接子节点，且 label 在前。
- 每个 item 必须有 label 与 content。

## 源码

- 协议：`spec/components/descriptions.spec.json`
- React：`packages/react/src/descriptions.tsx`
- Vue：`packages/vue/src/descriptions.ts`

## 关于 L3

antd 用 `table` 实现描述列表，我们用 `div + flex`。两者结构不同，因此 L3 只比根节点，
内部布局不在比对范围内——这是协议主动放弃的对齐，理由写在这里。
