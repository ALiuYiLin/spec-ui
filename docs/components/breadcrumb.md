# Breadcrumb

面包屑。一串层级链接，用分隔符连接。

## 结构

| 槽位 | 类名 | 说明 |
|---|---|---|
| 根 | `sm-breadcrumb` | 必填 |
| item | `sm-breadcrumb__item` | 必填 |
| separator | `sm-breadcrumb__separator` | 可选 |

## 状态

| 属性 | 取值 |
|---|---|---|
| — | 无 |

## 不变量

- root 必须是 nav 且带 aria-label。
- 最后一个 item 之后不得出现 separator。
- separator 必须 aria-hidden。
- 当前页（最后一项）不得是链接。

## 源码

- 协议：`spec/components/breadcrumb.spec.json`
- React：`packages/react/src/breadcrumb.tsx`
- Vue：`packages/vue/src/breadcrumb.ts`
