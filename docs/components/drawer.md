# Drawer

抽屉。与 Modal 同构（遮罩 + 面板），区别是面板贴着视口一侧，宽度由 props 决定。

## 代码演示

:::demo 从右侧滑出，面板宽度可通过 `width` 指定。

drawer/basic

:::
## 结构

| 槽位 | 类名 | 说明 |
|---|---|---|
| 根 | `sm-drawer` | `fixed` 铺满视口，portal 到 body |
| 遮罩 | `sm-drawer__mask` | `rgba(0,0,0,.45)` |
| 面板 | `sm-drawer__panel` | **几何内联样式**决定宽度；`role="dialog"` |
| 关闭 | `sm-drawer__close` | 右上角 |
| 头部 | `sm-drawer__header` | 内边距 `16px 24px`、底部分隔线 |
| 标题 | `sm-drawer__title` | 16/24，字重 600 |
| 主体 | `sm-drawer__body` | 内边距 24，占据剩余高度 |

## 与 Modal 的差异

| | Modal | Drawer |
|---|---|---|
| 面板位置 | 居中、距顶 100 | 贴 `data-side` 指定的一侧 |
| 面板尺寸 | 固定 520 | 宽度由 props 决定（几何内联） |
| 布局 | 块级 | flex 纵向，主体撑满剩余高度 |
| 底部 | 有 footer | 无 |

面板是 `display: flex; flex-direction: column`，头部 `flex: 0 1 0%`、主体 `flex: 1 1 0%`——
这是让主体自动填满剩余高度的关键，写成块级布局会得到一个只有内容高度的面板。

## 视觉基线

| 项 | 值 |
|---|---|
| 遮罩 | `rgba(0,0,0,.45)`，`z-index: 1000` |
| 面板 | 宽 378、白底、左侧投影 `-6px 0 16px rgba(0,0,0,.08)` 等三层 |
| 头部 | `padding: 16px 24px`，底部 1px `rgba(5,5,5,.06)` |
| 主体 | `padding: 24px` |

## 已知边界

- antd 把宽度与投影放在 `content-wrapper`、把白底放在 `content`；协议合并成一个 `panel`，
  因此 L3 比对 `panel` 时忽略 `box-shadow` 与定位属性，并在文档里说明。
- 进出场动画不参与比对。

## 源码

- 协议：`spec/components/drawer.spec.json`
- React：`packages/react/src/drawer.tsx`
- Vue：`packages/vue/src/drawer.ts`
