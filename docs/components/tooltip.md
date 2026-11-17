# Tooltip

文字提示。第一个「触发器 + 浮层」分离的组件。

## 代码演示

:::demo hover 或 focus 触发；浮层通过 `side` 决定出现在哪一侧。

tooltip/demo-1

:::
## 结构

| 槽位 | 类名 | 说明 |
|---|---|---|
| 浮层根 | `sm-tooltip` | **portal 到 body**，`role="tooltip"`，携带 `data-state` / `data-side` |
| 触发器 | `sm-tooltip__trigger` | 留在文档流，持有 `aria-describedby` |
| 内容 | `sm-tooltip__inner` | 深色气泡 |
| 箭头 | `sm-tooltip__arrow` | `aria-hidden`，按 side 定位 |

## 一条重要的结构约定

浮层是**条件渲染**，不是 `display: none`。`state=closed` 时 root 根本不存在——
所以 `aria-describedby` 也必须随之移除，否则辅助技术会指向一个不存在的 id。

## 新的协议用法

- `portal: true` 第一次用在**根节点自身**（Select 是部件）
- `data-side` 第一次被使用
- 定位靠几何内联样式（`left` / `top` / `transform`），与 Slider 的 `geometry` 共用同一套白名单

## 视觉基线

| 项 | 值 |
|---|---|
| 气泡 | 内边距 6×8、圆角 6、底色 `rgba(0,0,0,.85)`、白字 |
| 最小尺寸 | 28×32 |
| 阴影 | `0 6px 16px rgba(0,0,0,.08)` 等三层 |
| 最大宽度 | 250 |

## 源码

- 协议：`spec/components/tooltip.spec.json`
- React：`packages/react/src/tooltip.tsx`
- Vue：`packages/vue/src/tooltip.ts`
