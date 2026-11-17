# Slider

滑块。第一个「尺寸与位置由数值实时算出」的组件。

## 代码演示

:::demo 轨道宽度与手柄位移由数值算出，方向键步进，Home / End 跳到两端。

slider/demo-1

:::
## 结构

| 槽位 | 类名 | 说明 |
|---|---|---|
| 根 | `sm-slider` | `position: relative`，高度 12 |
| 轨道底 | `sm-slider__rail` | 绝对定位，高 4，圆角 2 |
| 选中段 | `sm-slider__track` | **几何内联样式**：横向只写 `width` |
| 手柄 | `sm-slider__handle` | 唯一可聚焦元素，`role="slider"`，横向只写 `left` |

手柄本身是 10×10 的透明盒子，白色圆盘与蓝色描边画在 `::after` 上——和 antd 一致。

## 协议的新规则：geometry

`protocol.schema.json` 新增 `geometry: true`。标了这个字段的部件允许写内联样式，但**只允许几何属性**
（`width` / `height` / `left` / `bottom`）。混入任何颜色、边框、背景，校验器直接报错。

这是继 `portal` 之后第二个「内联样式例外」，边界同样是封闭的。

## 状态

| 属性 | 取值 |
|---|---|
| `data-orientation` | `horizontal` `vertical` |
| `data-disabled` | 布尔 |

`aria-valuenow` 必须是业务值（0–100 的数值），不是位置百分比。

## 视觉基线

| 项 | 值 |
|---|---|
| 根 | 高 12、`padding: 4px 0`、`margin: 11px 5px` |
| 轨道底 | 高 4、圆角 2、`rgba(0,0,0,.04)` |
| 选中段 | 高 4、圆角 2、`#91CAFF`（主色的浅色） |
| 手柄 | 10×10、`translateX(-5px)`、白底 + 2px `#1677FF` 描边 |

选中段用浅主色而不是主色本身——这条只有比对计算样式才会发现。

## 源码

- 协议：`spec/components/slider.spec.json`
- React：`packages/react/src/slider.tsx`
- Vue：`packages/vue/src/slider.ts`
