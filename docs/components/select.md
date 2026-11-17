# Select

单选下拉。第一个带 portal 浮层、键盘游标与状态镜像的组件。

## 代码演示

:::demo 点击展开浮层；`status` 表达校验态，`clearable` 允许清空当前值。

select/basic

:::

:::demo `size` 只影响高度、内边距与字号，不改变交互。

select/sizes

:::

:::demo 三种形态由 `variant` 决定：`outlined` / `filled` / `borderless`。

select/variants

:::

:::demo `status` 表达校验态，与 Input 共用同一套语义。

select/status

:::

:::demo `allowClear` 在有值时把箭头位置让给清除按钮；`showArrow=false` 可彻底隐藏箭头。

select/clearable

:::

:::demo 禁用态不可展开，也不响应键盘。

select/disabled

:::

:::demo `open` 受控时组件不自己改状态——展开态可以直接由 props 指定，便于截图与对拍。

select/open

:::
## 结构

| 槽位 | 类名 | 说明 |
|---|---|---|
| 根 | `sm-select` | 持有 `data-state`，是开放状态的语义所有者 |
| 控制框 | `sm-select__control` | 视觉边框盒，焦点反馈走 `:focus-within` |
| 输入 | `sm-select__input` | 唯一可访问入口，`role="combobox"`、`readonly` |
| 文本 / 占位 | `sm-select__value` / `sm-select__placeholder` | 二者互斥 |
| 清除 / 箭头 | `sm-select__clear` / `sm-select__arrow` | 共用一个槽位 |
| 浮层 | `sm-select__dropdown` | **portal 到 body**，镜像根节点 `data-state` |
| 选项 | `sm-select__option` | `role="option"`，单个节点同时承担语义与视觉 |

## 状态

| 属性 | 取值 |
|---|---|
| `data-state` | `open` `closed`（`visibility` 值域） |
| `data-variant` | `outlined` `filled` `borderless` |
| `data-status` | `default` `error` `warning` |
| `data-selected` / `data-highlighted` / `data-disabled` | 布尔，可叠加 |

`selected` 是持久态，`highlighted` 是键盘游标——两者正交，可以同时成立。

## 两个容易踩的点

**option 只有一份。** antd 会渲染「ARIA 镜像 + 视觉节点」两份，照抄会让 `role="option"` 的节点
既透明又零高。协议要求单节点，校验器第 9 条规则会直接拒绝镜像。

**浮层宽度必须与触发器一致。** 浮层脱离根子树，只能实测后以几何内联样式写入——
这是协议里唯一允许内联 `style` 的地方，且只允许宽高与定位。

## 视觉基线

| 项 | 值 |
|---|---|
| 控制框（md） | 高 32、圆角 6、左右 padding 11 |
| 悬浮 | 边框转 `#4096FF` |
| 聚焦 | 边框 `#1677FF` + `box-shadow: 0 0 0 2px rgba(5,145,255,.1)` |
| 选中项 | 底色 `#E6F4FF`、字重 600 |
| 高亮项 | 底色 `rgba(0,0,0,.04)` |
| 浮层 | 圆角 8、padding 4、`z-index: 1050` |

## 源码

- 协议：`spec/components/select.spec.json`
- React：`packages/react/src/select.tsx`
- Vue：`packages/vue/src/select.ts`
