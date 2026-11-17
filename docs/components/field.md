# Field

表单项外壳：标签、控件槽位、错误信息。它不渲染任何控件，只负责布局与状态传递。

## 代码演示

:::demo 表单项外壳：标签在上、控件居中、错误在下，控件由使用方通过插槽传入。

field/basic

:::
:::demo `status` 决定标签与提示的配色，`error` 文案挂在字段下方。

field/status

:::

## 结构

| 槽位 | 类名 | 说明 |
|---|---|---|
| 根 | `sm-field` | 纵向布局容器 |
| 标签 | `sm-field__label` | 可选；必填星号由 `::before` 绘制，不占 DOM |
| 控件 | `sm-field__control` | 必填且唯一，控件由使用方放入 |
| 错误 | `sm-field__error` | 可选，`role="alert"` |

## 状态

| 属性 | 取值 |
|---|---|
| `data-status` | `default` `error` `warning` |
| `data-required` | 布尔 |

## 为什么 L3 只比 label

antd 的 `Form.Item` 在 label、控件、explain 之间各插了一层包裹元素，根节点与控件容器的盒子模型由那两层决定。要把它们逐像素对上，等于把 antd 的内部结构抄进协议——那恰恰是协议要避免的。

所以 Field 的视觉验收只比 label：字体、颜色、行高、对齐严格比对，`display` / 宽度 / `transform-origin` 这几项由外层容器决定，明确跳过。

**这是第一个「协议主动放弃部分像素对齐」的组件**，理由写在这里，不是悄悄放过。

## 视觉基线

| 项 | 值 |
|---|---|
| 根 | 块级，下外边距 24 |
| 标签 | 14/22，`cursor: default`，与控件间距 8 |
| 必填标记 | `*`，`#FF4D4F`，右侧 4px |
| 错误文案 | 14/22，`#FF4D4F`，上间距 2 |

## 源码

- 协议：`spec/components/field.spec.json`
- React：`packages/react/src/field.tsx`
- Vue：`packages/vue/src/field.ts`
