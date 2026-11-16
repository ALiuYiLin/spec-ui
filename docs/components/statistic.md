# Statistic

统计数值。一行标题加一个大号数字。

## 结构

| 槽位 | 类名 | 说明 |
|---|---|---|
| 根 | `sm-statistic` | 必填 |
| title | `sm-statistic__title` | 可选 |
| value | `sm-statistic__value` | 必填 |

## 状态

| 属性 | 取值 |
|---|---|---|
| — | 无 |

## 不变量

- value 必须存在且只出现一次。
- title 若存在必须位于 value 之前。
- 数值格式化（千分位、小数位）由实现负责，不体现在 DOM 契约里。

## 源码

- 协议：`spec/components/statistic.spec.json`
- React：`packages/react/src/statistic.tsx`
- Vue：`packages/vue/src/statistic.ts`
