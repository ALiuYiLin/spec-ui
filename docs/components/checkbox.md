# Checkbox

复选框。`selection` 状态值域第一次落地。

## 代码演示

:::demo 受控组件：`checked` 决定状态，禁用使用原生 `disabled`。

checkbox/basic

:::
### 半选与禁用

:::demo `indeterminate` 用于「部分选中」的父级复选框。

checkbox/indeterminate

:::
## 结构

| 槽位 | 类名 | 说明 |
|---|---|---|
| 根 | `sm-checkbox` | `<label>`，持有 `data-state` |
| 控制 | `sm-checkbox__control` | 16×16 定位容器，承载绝对定位的 input |
| 输入 | `sm-checkbox__input` | 原生 checkbox，`opacity: 0` 但可聚焦 |
| 方框 | `sm-checkbox__box` | 纯视觉，`aria-hidden`，勾号由 `::after` 绘制 |
| 文本 | `sm-checkbox__label` | 可选 |

`control` 这一层不是语义分组，而是**定位上下文**——原生 input 需要绝对定位盖在方框上，
必须有一个 `position: relative` 的祖先。

## 状态

| 属性 | 取值 |
|---|---|
| `data-state` | `checked` `unchecked` `indeterminate`（`selection` 值域） |
| `data-disabled` | 布尔 |

半选状态必须通过 `input.indeterminate = true` 告知辅助技术，只改 `data-state` 不够。

## 两个比对出来的细节

1. **半选时方框外观不变**——仍是白底灰边，横线由 `::after` 画。只看 DOM 会误以为它与未选相同。
2. **焦点环挂在 `:focus` 而不是 `:focus-visible`**，程序化聚焦也会出环。

## 视觉基线

| 项 | 值 |
|---|---|
| 方框 | 16×16、圆角 4、边框 `#D9D9D9` |
| 已选 | 底色 `#1677FF`、边框同色、白色勾号 |
| 悬浮 | 未选时边框转 `#1677FF`；已选时底色转 `#4096FF` |
| 禁用 | 底色 `rgba(0,0,0,.04)`，`pointer-events: none` |
| 文本 | 左右各 8px padding |

## 源码

- 协议：`spec/components/checkbox.spec.json`
- React：`packages/react/src/checkbox.tsx`
- Vue：`packages/vue/src/checkbox.ts`
