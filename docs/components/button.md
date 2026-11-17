# Button

触发单一动作。叶子组件：无浮层、无内部状态机，全部状态由 props 与交互伪类决定。

## 何时使用 {#when-to-use}

- 标识一个操作，点击后立即生效（提交、删除、确认）
- 表单的最终动作，通常放在右下角
- 需要用户明确做出选择后才能继续的场景

不适合用按钮的：需要跳转到另一处且不改变当前状态时，用链接（`variant="link"`）；
需要在一组选项里选一个时，用 Radio 或 Select。

## 代码演示 {#examples}

### 类型

默认按钮用于次要动作，主按钮用于一个区域里最重要的那一个。

::: demo 按钮类型
<SmButton variant="primary" label="主按钮" />
<SmButton label="默认按钮" />
<SmButton variant="dashed" label="虚线按钮" />
<SmButton variant="text" label="文本按钮" />
<SmButton variant="link" label="链接按钮" />
:::

### 颜色与变体的组合

协议把外观拆成两个正交维度：`data-variant`（形态）× `data-danger`（语义色）。
实际可组合出 10 种：主色没有 `default`/`dashed` 形态，危险色则五态齐全。

::: demo 默认色
<div style="display: flex; flex-wrap: wrap; gap: 8px; width: 100%">
  <SmButton label="默认" />
  <SmButton variant="dashed" label="虚线" />
  <SmButton variant="text" label="文本" />
  <SmButton variant="link" label="链接" />
</div>
:::

::: demo 主色
<div style="display: flex; flex-wrap: wrap; gap: 8px; width: 100%">
  <SmButton variant="primary" label="实心" />
  <SmButton variant="primary" :loading="true" label="加载" />
</div>
:::

::: demo 危险色
<div style="display: flex; flex-wrap: wrap; gap: 8px; width: 100%">
  <SmButton tone="danger" variant="primary" label="实心" />
  <SmButton tone="danger" label="默认" />
  <SmButton tone="danger" variant="dashed" label="虚线" />
  <SmButton tone="danger" variant="text" label="文本" />
  <SmButton tone="danger" variant="link" label="链接" />
</div>
:::

### 尺寸

尺寸只由 `data-size` 决定，不通过额外类名切换。

::: demo 三种常用尺寸
<SmButton size="sm" label="小" />
<SmButton label="中" />
<SmButton size="lg" label="大" />
:::

### 形状

::: demo 圆角与圆形
<SmButton shape="round" label="圆角" />
<SmButton shape="circle" label="A" />
<SmButton variant="primary" shape="round" label="圆角主色" />
<SmButton variant="primary" shape="circle" label="B" />
:::

### 加载与禁用

加载中的按钮不可点击；禁用用原生 `disabled`，不是只改颜色。

::: demo 加载与禁用
<SmButton variant="primary" :loading="true" label="提交" />
<SmButton :loading="true" label="提交" />
<SmButton variant="primary" :disabled="true" label="提交" />
<SmButton :disabled="true" label="提交" />
:::

### 块级

`block` 让按钮占满容器宽度。

::: demo 块级按钮
<div style="width: 100%">
  <SmButton variant="primary" :block="true" label="提交" />
  <div style="height: 8px"></div>
  <SmButton :block="true" label="取消" />
</div>
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
| `data-danger` / `data-block` / `data-loading` / `data-disabled` | 布尔 |

交互态一律伪类：`:hover` `:active` `:focus-visible`，没有任何状态类名。

### 与 antd 的差异

antd 的 Button 有 `color`（default/primary/danger 及 13 个预设色）× `variant`（solid/outlined/dashed/filled/text/link）两个轴。
SpecMark 目前只有：

| | antd | SpecMark |
|---|---|---|
| 形态 | 6 种（含 solid/outlined/filled） | 5 种（default 即 antd 的 outlined，primary 即 solid） |
| 颜色 | 默认 + 13 预设 | 默认 + danger 两种语义色 |
| 组合 | 任意色 × 任意形态 | 主色只有实心，危险色五态齐全 |

**这是一处有意收窄**：预设色需要每个色相的 10 级色阶（亮暗各一套），会把令牌数量翻几倍。
真要支持，属于协议级变更（新增 `color` 值域 + 色阶生成），不是加几个 demo 能补的。

## 设计约束 {#constraints}

### 文案规范化

`label` 恰为两个 CJK 字符、无 icon、且 `variant` 不是 `text`/`link` 时，会在两字之间插入一个空格
（`"提交"` → `"提 交"`）。这是 DOM 文本改写，不是样式——由实现负责，否则两套实现的按钮宽度会差 3.84px。

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
| `--color-sm-danger` | `#ff4d4f` | `#dc4446` |
| `--color-sm-shadow-btn` | `rgba(0,0,0,.02)` | `rgba(255,255,255,.04)` |

## 源码

- 协议：`spec/components/button.spec.json`
- React：`packages/react/src/button.tsx`
- Vue：`packages/vue/src/button.ts`
