# Popover

气泡卡片。与 Tooltip 同构，但内容是白底卡片、可放交互元素。

## 演示

<Demo note="hover 或 focus 触发；内容可以放按钮">
  <SmPopover title="标题" content="这是一段说明文字" side="top">
    <SmButton label="悬停我" />
  </SmPopover>
  <SmPopover content="没有标题的版本" side="bottom">
    <SmButton variant="text" label="也可以是文字" />
  </SmPopover>
</Demo>

## 结构

| 槽位 | 类名 | 说明 |
|---|---|---|
| 浮层根 | `sm-popover` | portal 到 body，携带 `data-state` / `data-side` / `data-align` |
| 触发器 | `sm-popover__trigger` | 留在文档流，持有 `aria-describedby` |
| 卡片 | `sm-popover__inner` | 白底、圆角 8、12 内边距、三层阴影 |
| 标题 | `sm-popover__title` | 可选，字重 600 |
| 内容 | `sm-popover__content` | 必填 |
| 箭头 | `sm-popover__arrow` | `aria-hidden` |

## 与 Tooltip 的差异

| | Tooltip | Popover |
|---|---|---|
| 底色 | 深色 `rgba(0,0,0,.85)` | 白底 |
| 最小宽度 | 28 | 由内容/标题撑开 |
| 可交互 | 不应含交互元素 | 允许 |
| 维度 | `side` | `side` + `align` |

`data-align` 在这里第一次被使用。

## 视觉基线

| 项 | 值 |
|---|---|
| 卡片 | 内边距 12、圆角 8、白底 |
| 标题 | 14/22，字重 600，下外边距 8，`min-width: 177` |
| 阴影 | `0 6px 16px rgba(0,0,0,.08)` 等三层 |
| 层级 | z-index 1030 |

注意卡片本身**没有** `min-width`——普通情况下宽度 177 是被标题的 `min-width` 撑出来的，没有标题时就只有内容那么宽。这条只有同时比对两个用例才会发现。

## 源码

- 协议：`spec/components/popover.spec.json`
- React：`packages/react/src/popover.tsx`
- Vue：`packages/vue/src/popover.ts`
