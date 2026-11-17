# InputNumber

数字输入框。第一个「一个可访问单元由多个控件组成」的组件。

## 代码演示

<Demo note="步进按钮只在 hover 时出现；点击后焦点留在输入框">
  <SmInputNumber :model-value="5" style="width: 120px" aria-label="数量" />
  <SmInputNumber :model-value="5" :disabled="true" style="width: 120px" aria-label="禁用" />
  <SmInputNumber :model-value="5" status="error" style="width: 120px" aria-label="错误" />
</Demo>

## 结构

| 槽位 | 类名 | 说明 |
|---|---|---|
| 根 | `sm-input-number` | 边框盒，`position: relative` |
| 语义层 | `sm-input-number__wrap` | `role="spinbutton"`，`aria-valuenow` 挂在这里 |
| 输入 | `sm-input-number__input` | 文本型 input + `inputmode="decimal"` |
| 步进容器 | `sm-input-number__handler` | 绝对定位在右侧，默认 `opacity: 0` |
| 上下按钮 | `sm-input-number__handler-up` / `-down` | 各自带 `aria-label` |

`role="spinbutton"` 在 wrap 上而不是 input 上——这是 antd 的做法，也是协议的规定。

## 状态

| 属性 | 取值 |
|---|---|
| `data-size` | `sm` `md` `lg` |
| `data-status` | `default` `error` `warning` |
| `data-disabled` / `data-readonly` | 布尔 |

`disabled` 时步进容器整体不渲染，而不是靠 CSS 隐藏。

## 为什么用文本型 input

`<input type="number">` 的原生步进、滚轮行为与本地化在不同浏览器差异很大。协议选择
`type="text"` + `inputmode="decimal"`，把数值约束交给实现，视觉与交互才可控。

## 视觉基线

| 尺寸 | 高 | 圆角 | input padding |
|---|---|---|---|
| sm | 24px | 4px | 0 7px |
| md | 32px | 6px | 4px 11px |
| lg | 40px | 8px | 7px 11px |

聚焦：边框 `#1677FF` + `0 0 0 2px rgba(5,145,255,.1)`，同时把根节点的 `outline-width` 归零。

## 源码

- 协议：`spec/components/input-number.spec.json`
- React：`packages/react/src/input-number.tsx`
- Vue：`packages/vue/src/input-number.ts`
