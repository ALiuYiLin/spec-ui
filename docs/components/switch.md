# Switch

开关。第一个**没有原生 input** 的表单类控件：语义完全由 `role="switch"` 与 `aria-checked` 承载。

## 代码演示

:::demo 开关是 `button[role="switch"]`，没有原生 input，状态由 `aria-checked` 表达。

switch/demo-1

:::
### 禁用与加载

:::demo 禁用用原生 `disabled`；加载态下不可切换，但仍保留 `role="switch"`。

switch/demo-2

:::
## 结构

| 槽位 | 类名 | 说明 |
|---|---|---|
| 根 | `sm-switch` | `<button type="button" role="switch">`，持有 `data-state` |
| 滑块 | `sm-switch__handle` | 绝对定位；白色圆点由 `::before` 绘制 |
| 文案 | `sm-switch__inner` | 可选，轨道内文字 |

滑块本身是透明盒子、圆角为 0——和 antd 一样，白色圆盘与阴影画在 `::before` 上。
只比 DOM 的话会以为滑块没有背景。

## 状态

| 属性 | 取值 |
|---|---|
| `data-state` | `on` `off`（`toggle` 值域） |
| `data-size` | `sm` `md` |
| `data-disabled` / `data-loading` | 布尔 |
| `aria-checked` | 必须与 `data-state` 严格对应 |

`data-state="on"` 与 `aria-checked="true"` 必须同时成立，只改一个就是 bug。

## 视觉基线

| 项 | 值 |
|---|---|
| 轨道（md） | 44×22、`border-radius: 100px`、关 `rgba(0,0,0,.25)` / 开 `#1677FF` |
| 轨道（sm） | 28×16、行高 16 |
| 滑块 | 18×18（sm 为 12×12），距边 2px，白色、圆角等于半宽 |
| 悬浮 | 关 `rgba(0,0,0,.45)`，开 `#4096FF` |
| 禁用 | 整体 `opacity: .65`，`cursor: not-allowed` |

## 源码

- 协议：`spec/components/switch.spec.json`
- React：`packages/react/src/switch.tsx`
- Vue：`packages/vue/src/switch.ts`
