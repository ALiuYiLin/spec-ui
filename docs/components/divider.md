# Divider

分割线。线条由伪元素绘制，DOM 里只有一个根节点（可选一个文字槽位）。

## 代码演示

:::demo 横线用于分隔内容块，也可以带一段文字。
  <div style="width: 240px">
    <SmDivider />
    <SmDivider variant="dashed" />
    <SmDivider>文本</SmDivider>
  </div>
:::

## 结构

| 槽位 | 类名 | 说明 |
|---|---|---|
| 根 | `sm-divider` | 唯一必需节点 |
| 文字 | `sm-divider__text` | 可选，有文字时才渲染 |

## 状态

| 属性 | 取值 |
|---|---|
| `data-orientation` | `horizontal` `vertical` |
| `data-variant` | `solid` `dashed` `dotted` |

## 两条约定

- **线条不进 DOM**：用 `border-top` 画在根节点上，不要塞 `<span>` 做线
- `clear: both` 是必需的——antd 的分割线要阻断上方浮动

## 视觉基线

| 项 | 值 |
|---|---|
| 高度 | 1px（就是边框本身） |
| 外边距 | `24px 0` |
| 颜色 | `rgba(5,5,5,.06)` |

## 源码

- 协议：`spec/components/divider.spec.json`
- React：`packages/react/src/divider.tsx`
- Vue：`packages/vue/src/divider.ts`
