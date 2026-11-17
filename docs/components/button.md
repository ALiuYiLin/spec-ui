# Button

触发单一动作。叶子组件：无浮层、无内部状态机，全部状态由 props 与交互伪类决定。

## 何时使用 {#when-to-use}

- 标识一个操作，点击后立即生效（提交、删除、确认）
- 表单的最终动作，通常放在右下角
- 需要用户明确做出选择后才能继续的场景

不适合用按钮的：需要跳转到另一处且不改变当前状态时，用链接（`variant="link"`）；
需要在一组选项里选一个时，用 Radio 或 Select。

## 代码演示 {#examples}

默认按钮用于次要动作，主按钮用于一个区域里最重要的那一个。

::: demo 按钮类型
<SmButton variant="primary" label="提交" />
<SmButton label="默认" />
<SmButton variant="dashed" label="虚线" />
<SmButton variant="text" label="文本" />
<SmButton variant="link" label="链接" />
:::

尺寸只由 `data-size` 决定，形状只由 `data-shape` 决定。

::: demo 尺寸与形状
<SmButton variant="primary" size="sm" label="小" />
<SmButton variant="primary" label="中" />
<SmButton variant="primary" size="lg" label="大" />
<SmButton variant="primary" shape="round" label="圆角" />
<SmButton danger label="删除" />
:::

加载中的按钮不可点击；禁用用原生 `disabled`，不是只改颜色。

::: demo 加载与禁用
<SmButton variant="primary" :loading="true" label="提交" />
<SmButton variant="primary" :disabled="true" label="提交" />
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
| `data-variant` | `default` `primary` `dashed` `text` `link` |
| `data-size` | `xs` `sm` `md` `lg` `xl` |
| `data-shape` | `default` `round` `circle` |
| `data-danger` / `data-block` / `data-loading` / `data-disabled` | 布尔 |

交互态一律伪类：`:hover` `:active` `:focus-visible`，没有任何状态类名。

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
| `--color-sm-shadow-btn` | `rgba(0,0,0,.02)` | `rgba(255,255,255,.04)` |

## 源码

- 协议：`spec/components/button.spec.json`
- React：`packages/react/src/button.tsx`
- Vue：`packages/vue/src/button.ts`
