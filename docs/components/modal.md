# Modal

模态框。第一个自带遮罩与层级分层的组件。

## 演示

<Demo note="遮罩 + 对话框两级结构；关闭按钮在右上角">
  <ModalDemo />
</Demo>

## 结构

| 槽位 | 类名 | 说明 |
|---|---|---|
| 根 | `sm-modal` | `fixed` 铺满视口，**portal 到 body**，只在 open 时渲染 |
| 遮罩 | `sm-modal__mask` | `rgba(0,0,0,.45)`，`aria-hidden` |
| 对话框 | `sm-modal__dialog` | 白底、圆角 8、`role="dialog"` + `aria-modal` |
| 关闭 | `sm-modal__close` | 右上角，`aria-label` 必填 |
| 头部 | `sm-modal__header` | 必填，包住标题 |
| 标题 | `sm-modal__title` | 16/24，字重 600 |
| 主体 | `sm-modal__body` | 必填 |
| 底部 | `sm-modal__footer` | 可选，右对齐 |

## 一个结构性的坑

Modal 是第一个**没有文档流根**的组件——open 时只渲染 portal，`[data-case-root]` 里空无一物。

这让抓取脚本的 `waitForSelector('[data-case-root] > *')` 直接超时。修复方式是给纯浮层组件一条回退路径：
**文档流里找不到 `sm-*` 根时，退回到 `body` 下的第一个浮层根**。conformance、extract、visual-diff 三处都加了。

另外截图会失败——全屏浮层的根节点零尺寸，`elementHandle.screenshot` 报 "element is not visible"。
截图失败现在不会丢掉证据：JSON 照常写入，只是没有 PNG。

## 视觉基线

| 项 | 值 |
|---|---|
| 遮罩 | `rgba(0,0,0,.45)`，`z-index: 1000` |
| 对话框 | 宽 520、内边距 `20px 24px`、圆角 8、三层阴影、距顶 100 |
| 头部 | 下外边距 8，仅上两角圆角 8 |
| 标题 | 16/24，字重 600 |
| 底部 | 上外边距 12，右对齐 |

## 已知边界

- 进出场动画不在 L3 比对范围（证据在 `motion: false` 下采集）
- 遮罩点击关闭、Esc 关闭属于交互契约，协议不强制
- 焦点陷阱由使用方负责，协议只要求「打开时聚焦对话框内第一个可聚焦元素」

## 源码

- 协议：`spec/components/modal.spec.json`
- React：`packages/react/src/modal.tsx`
- Vue：`packages/vue/src/modal.ts`
