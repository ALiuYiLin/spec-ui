# Tag

标签。行内小色块，可关闭。

## 代码演示

<Demo>
  <SmTag>默认</SmTag>
  <SmTag tone="primary">主要</SmTag>
  <SmTag tone="success">成功</SmTag>
  <SmTag tone="warning">警告</SmTag>
  <SmTag tone="danger" :closable="true">可关闭</SmTag>
</Demo>

## 结构

| 槽位 | 类名 | 说明 |
|---|---|---|
| 根 | `sm-tag` | 行内块，`position: relative` |
| 关闭 | `sm-tag__close` | 可选，必须是 `<button>` |

## 状态

| 属性 | 取值 |
|---|---|
| `data-tone` | `default` `primary` `success` `warning` `danger` |

颜色只由 `data-tone` 表达，**不额外加类名**——这是协议里 `tone` 值域的规定。

## 视觉基线

| 项 | 值 |
|---|---|
| 尺寸 | 高 22，内边距 `0 7px` |
| 字体 | 12/20 |
| 边框 | 1px `#D9D9D9`，圆角 4 |
| 底色 | `#FAFAFA` |
| 右外边距 | 8 |

## 源码

- 协议：`spec/components/tag.spec.json`
- React：`packages/react/src/tag.tsx`
- Vue：`packages/vue/src/tag.ts`
