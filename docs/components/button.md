# Button

触发单一动作。叶子组件：无浮层、无内部状态机，全部状态由 props 与交互伪类决定。

## 演示

<Demo note="由 Vue 实现渲染；React 实现输出完全相同的 DOM">
  <SmButton variant="primary" label="提交" />
  <SmButton label="默认" />
  <SmButton variant="dashed" label="虚线" />
  <SmButton variant="text" label="文本" />
  <SmButton variant="link" label="链接" />
</Demo>

<Demo>
  <SmButton variant="primary" size="sm" label="小" />
  <SmButton variant="primary" size="lg" label="大" />
  <SmButton variant="primary" shape="round" label="圆角" />
  <SmButton danger label="删除" />
</Demo>

<Demo>
  <SmButton variant="primary" :loading="true" label="提交" />
  <SmButton variant="primary" :disabled="true" label="提交" />
</Demo>

## 结构

| 槽位 | 类名 | 说明 |
|---|---|---|
| 根 | `sm-btn` | 原生 `<button>`，必须显式 `type` |
| 图标 | `sm-btn__icon` | 可选，`aria-hidden`，必须是 root 直接子节点 |
| 加载 | `sm-btn__spinner` | `loading` 时替代 icon，与 icon 互斥 |
| 文本 | `sm-btn__label` | 必定存在且只有一个 |

## 状态

| 属性 | 取值 |
|---|---|
| `data-variant` | `default` `primary` `dashed` `text` `link` |
| `data-size` | `xs` `sm` `md` `lg` `xl` |
| `data-shape` | `default` `round` `circle` |
| `data-danger` / `data-block` / `data-loading` / `data-disabled` | 布尔 |

交互态一律伪类：`:hover` `:active` `:focus-visible`，没有任何状态类名。

## 文案规范化

`label` 恰为两个 CJK 字符、无 icon、且 `variant` 不是 `text`/`link` 时，会在两字之间插入一个空格
（`"提交"` → `"提 交"`）。这是 DOM 文本改写，不是样式——由实现负责，否则两套实现的按钮宽度会差 3.84px。

## 视觉基线

| 尺寸 | 高 | 左右 padding | 圆角 | 字号 |
|---|---|---|---|---|
| sm | 24px | 7px | 4px | 14px |
| md | 32px | 15px | 6px | 14px |
| lg | 40px | 15px | 8px | 16px |

焦点环：`outline: 3px solid #91CAFF` + `outline-offset: 1px`。

## 源码

- 协议：`spec/components/button.spec.json`
- React：`packages/react/src/button.tsx`
- Vue：`packages/vue/src/button.ts`
