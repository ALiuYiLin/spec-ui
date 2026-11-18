# Card

卡片。带边框的容器，可选标题区。

## 代码演示

:::demo 标题区可选，主体承载任意内容。

card/basic

:::
:::demo `title` 与 `extra` 分列头部两端，`content` 放正文。

card/extra

:::

## 结构

<table>
  <thead>
    <tr>
      <th colspan="3">槽位</th>
      <th>说明</th>
    </tr>
    <tr>
      <th>第 1 层</th>
      <th>第 2 层</th>
      <th>第 3 层</th>
      <th>可选性</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="4"><code>sm-card</code></td>
      <td rowspan="3"><code>sm-card__header</code></td>
      <td><code>sm-card__head-wrapper</code></td>
      <td>可选：header 内部的 flex-row 层</td>
    </tr>
    <tr>
      <td><code>sm-card__title</code></td>
      <td>可选：传入 title 时渲染</td>
    </tr>
    <tr>
      <td>extra 插槽</td>
      <td>可选：调用方传入的节点</td>
    </tr>
    <tr>
      <td colspan="2"><code>sm-card__body</code></td>
      <td>必填：主体内容</td>
    </tr>
  </tbody>
</table>

每一列代表一层 DOM 深度，`rowspan` 表示节点包含下面几行。

三层嵌套是为了对齐 antd：`head` 是 `flex-column`，真正分列两端的 `flex-row` 在
`head-wrapper` 上，`title` 与 `extra` 都是它的子节点。

## 状态

| 属性 | 取值 |
|---|---|
| — | 无 |

## 不变量

- body 必须存在且只出现一次。
- header 若存在必须位于 body 之前；title 若存在必须在 head-wrapper 里。
- 圆角只在 root 上；header 不做独立圆角。

## 源码

- 协议：`spec/components/card.spec.json`
- React：`packages/react/src/card.tsx`
- Vue：`packages/vue/src/card.ts`
