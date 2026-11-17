# Skeleton

骨架屏。几条灰色占位条，表示内容正在加载。

## 代码演示

:::demo 内容加载前的占位条，`rows` 控制段落行数。

skeleton/demo-1

:::
### 行数

:::demo `rows` 控制段落行数，`title` 控制是否渲染标题占位。

skeleton/demo-2

:::
## 结构

| 槽位 | 类名 | 说明 |
|---|---|---|
| 根 | `sm-skeleton` | 必填 |
| title | `sm-skeleton__title` | 可选 |
| paragraph | `sm-skeleton__paragraph` | 必填 |
| item | `sm-skeleton__item` | 可选 |

## 状态

| 属性 | 取值 |
|---|---|---|
| — | 无 |

## 不变量

- paragraph 必须存在且只出现一次。
- item 必须是 paragraph 的直接子节点，数量与行数一致。
- title 若存在必须位于 paragraph 之前。

## 源码

- 协议：`spec/components/skeleton.spec.json`
- React：`packages/react/src/skeleton.tsx`
- Vue：`packages/vue/src/skeleton.ts`
