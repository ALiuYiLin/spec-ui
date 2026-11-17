# Space

间距容器。给一组子元素加统一间距。

## 代码演示

:::demo 给一组子元素统一间距，`direction` 控制横排或竖排。

space/basic

:::
## 结构

| 槽位 | 类名 | 说明 |
|---|---|---|
| 根 | `sm-space` | 必填 |
| item | `sm-space__item` | 必填 |

## 状态

| 属性 | 取值 |
|---|---|
| `direction` | `horizontal` `vertical` |
| `size` | `sm` `md` `lg` |

## 不变量

- 每个子元素必须被包裹为 item，不得直接放到 root 下。
- 间距只由 gap 决定，不得使用 margin。
- direction=vertical 时 flex-direction 必须是 column。

## 源码

- 协议：`spec/components/space.spec.json`
- React：`packages/react/src/space.tsx`
- Vue：`packages/vue/src/space.ts`
