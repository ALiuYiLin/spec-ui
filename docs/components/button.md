# Button

触发单一动作。叶子组件：无浮层、无内部状态机，全部状态由 props 与交互伪类决定。

## 何时使用 {#when-to-use}

- 标识一个操作，点击后立即生效（提交、删除、确认）
- 表单的最终动作，通常放在右下角
- 需要用户明确做出选择后才能继续的场景

不适合用按钮的：需要跳转到另一处且不改变当前状态时，用链接（`variant="link"`）；
需要在一组选项里选一个时，用 Radio 或 Select。

## 代码演示 {#examples}

### 形态

用 `variant` 决定按钮的形态：`solid` 实心、`default` 描边、`dashed` 虚线、`text` 文本、`link` 链接。

:::demo 实心用于最重要的动作，描边用于次要动作，虚线常用于「新增」类入口。
<SmButton variant="solid" label="主按钮" />
<SmButton label="默认按钮" />
<SmButton variant="dashed" label="虚线按钮" />
<SmButton variant="text" label="文本按钮" />
<SmButton variant="link" label="链接按钮" />
:::

### 颜色

用 `tone` 决定语义色，与 `variant` 正交组合。默认 `tone="default"` 表示中性色。

:::demo `tone="primary"` 是品牌主色。
<SmButton tone="primary" variant="solid" label="实心" />
<SmButton tone="primary" label="描边" />
<SmButton tone="primary" variant="dashed" label="虚线" />
<SmButton tone="primary" variant="text" label="文本" />
<SmButton tone="primary" variant="link" label="链接" />
:::

:::demo `tone="success"` 用于正向操作。
<SmButton tone="success" variant="solid" label="实心" />
<SmButton tone="success" label="描边" />
<SmButton tone="success" variant="dashed" label="虚线" />
<SmButton tone="success" variant="text" label="文本" />
<SmButton tone="success" variant="link" label="链接" />
:::

:::demo `tone="warning"` 用于需要谨慎的操作。
<SmButton tone="warning" variant="solid" label="实心" />
<SmButton tone="warning" label="描边" />
<SmButton tone="warning" variant="dashed" label="虚线" />
<SmButton tone="warning" variant="text" label="文本" />
<SmButton tone="warning" variant="link" label="链接" />
:::

:::demo `tone="danger"` 用于删除、不可逆的操作。
<SmButton tone="danger" variant="solid" label="实心" />
<SmButton tone="danger" label="描边" />
<SmButton tone="danger" variant="dashed" label="虚线" />
<SmButton tone="danger" variant="text" label="文本" />
<SmButton tone="danger" variant="link" label="链接" />
:::

### 尺寸

尺寸只由 `data-size` 决定，不通过额外类名切换。

:::demo 三种常用尺寸。
<SmButton size="sm" label="小" />
<SmButton label="中" />
<SmButton size="lg" label="大" />
:::

### 形状

:::demo 圆角用于胶囊形入口，圆形用于只放图标的按钮。
<SmButton shape="round" label="圆角" />
<SmButton shape="circle" label="A" />
<SmButton tone="primary" variant="solid" shape="round" label="圆角主色" />
<SmButton tone="primary" variant="solid" shape="circle" label="B" />
:::

### 加载与禁用

:::demo 加载中的按钮不可点击；禁用使用原生 `disabled`，不是只改颜色。
<SmButton variant="solid" :loading="true" label="提交" />
<SmButton :loading="true" label="提交" />
<SmButton variant="solid" :disabled="true" label="提交" />
<SmButton :disabled="true" label="提交" />
:::

### 块级

:::demo `block` 让按钮占满容器宽度。
<div style="width: 100%">
  <SmButton variant="solid" :block="true" label="提交" />
  <div style="height: 8px"></div>
  <SmButton :block="true" label="取消" />
</div>
:::


### 全部尺寸

:::demo `xs` 只用于表格内的紧凑场景，`xl` 用于营销页的主行动点。
<SmButton variant="solid" size="xs" label="极小" />
<SmButton variant="solid" size="sm" label="小" />
<SmButton variant="solid" label="中" />
<SmButton variant="solid" size="lg" label="大" />
<SmButton variant="solid" size="xl" label="极大" />
:::

### 禁用状态

:::demo 每种形态都有对应的禁用样式，用的是原生 `disabled`，不是只降透明度。
<SmButton :disabled="true" label="描边" />
<SmButton variant="dashed" :disabled="true" label="虚线" />
<SmButton variant="solid" :disabled="true" label="实心" />
<SmButton variant="text" :disabled="true" label="文本" />
<SmButton variant="link" :disabled="true" label="链接" />
:::

### 图标按钮

:::demo `icon` 与 `loading` 互斥：加载态下图标会被 spinner 顶替。
<IconDemo />
:::

### 按钮组

:::demo 一组相关操作并排时保持 8px 间距即可，不需要额外的容器组件。
<div style="display: flex; gap: 8px">
  <SmButton label="取消" />
  <SmButton label="保存草稿" />
  <SmButton variant="solid" label="提交" />
</div>
:::

### 两字标签

:::demo 两个 CJK 字之间会自动插入空隙（`提 交`），这是 DOM 文本改写而非样式，两套实现口径一致。
<SmButton variant="solid" label="提交" />
<SmButton tone="danger" label="删除" />
<SmButton variant="dashed" label="确定" />
:::

## 协议 {#protocol}

### 结构

| 槽位 | 类名 | 说明 |
|---|---|---|
| 根 | `sm-btn` | 原生 `<button>`，必须显式 `type` |
| 图标 | `sm-btn__icon` | 可选，`aria-hidden`，必须是 root 直接子节点 |
| 加载 | `sm-btn__spinner` | `loading` 时替代 icon，与 icon 互斥 |
| 文本 | `sm-btn__label` | 必定存在且只有一个 |

### 状态

| 属性 | 取值 |
|---|---|
| `data-variant` | `default` `solid` `dashed` `text` `link` |
| `data-tone` | `default` `primary` `success` `warning` `danger` |
| `data-size` | `xs` `sm` `md` `lg` `xl` |
| `data-shape` | `default` `round` `circle` |
| `data-block` / `data-loading` / `data-disabled` | 布尔 |

形态与颜色是两个正交维度，共 **25 种组合**。交互态一律伪类：`:hover` `:active` `:focus-visible`，
没有任何状态类名。

### 与 antd 的差异

| | antd | SpecMark |
|---|---|---|
| 形态 | 6 种（solid / outlined / dashed / filled / text / link） | 5 种（`default` 即 outlined，无 filled） |
| 颜色 | default + primary + danger + 13 个预设色 | 5 个语义色 |
| 组合 | 任意色 × 任意形态 | 25 种，每个组合都有 antd 证据 |

**这是一处有意收窄**：预设色（pink / purple / cyan…）需要每个色相 10 级色阶、亮暗各一套，
令牌会从 60 涨到 300+。语义色足够表达意图，且每个都有 L3 证据：

| SpecMark | antd 对应 |
|---|---|
| `tone="success"` | `color="green"` |
| `tone="warning"` | `color="gold"` |
| `tone="danger"` | `danger` / `color="red"` |

## 设计约束 {#constraints}

### 文案规范化

`label` 恰为两个 CJK 字符、无 icon、且 `variant` 不是 `text`/`link` 时，会在两字之间插入一个空格
（`"提交"` → `"提 交"`）。这是 DOM 文本改写，不是样式——由实现负责，否则两套实现的按钮宽度会差 3.84px。

插槽里的纯文本同样要规范化，两套实现口径必须一致。

### 视觉基线

| 尺寸 | 高 | 左右 padding | 圆角 | 字号 |
|---|---|---|---|---|
| sm | 24px | 7px | 4px | 14px |
| md | 32px | 15px | 6px | 14px |
| lg | 40px | 15px | 8px | 16px |

焦点环：`outline: 3px solid #91CAFF` + `outline-offset: 1px`。

### 主题令牌

| 变量 | 亮色 | 暗色 |
|---|---|---|
| `--color-sm-primary` | `#1677ff` | `#1668dc` |
| `--color-sm-success` | `#52c41a` | `#49aa19` |
| `--color-sm-warning` | `#faad14` | `#d89614` |
| `--color-sm-danger` | `#ff4d4f` | `#dc4446` |
| `--color-sm-shadow-primary` | `rgba(5,145,255,.1)` | `rgba(23,117,249,.31)` |
| `--color-sm-shadow-success` | `rgba(142,255,30,.08)` | `rgba(40,170,0,.1)` |
| `--color-sm-shadow-warning` | `rgba(255,215,5,.1)` | `rgba(173,107,0,.15)` |

实心按钮的投影每个色调都不同，这是逐项比对 antd 才发现的。

## 源码

- 协议：`spec/components/button.spec.json`
- React：`packages/react/src/button.tsx`
- Vue：`packages/vue/src/button.ts`
