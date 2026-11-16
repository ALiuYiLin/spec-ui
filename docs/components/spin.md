# Spin

加载中。一个旋转的指示器。

## 结构

| 槽位 | 类名 | 说明 |
|---|---|---|
| 根 | `sm-spin` | 必填 |
| dot | `sm-spin__dot` | 必填 |
| tip | `sm-spin__tip` | 可选 |

## 状态

| 属性 | 取值 |
|---|---|
| `size` | `sm` `md` `lg` |

## 不变量

- root 必须带 role="status" 与可访问名称。
- dot 必须存在且只出现一次，并带 aria-hidden。
- 动画必须尊重 prefers-reduced-motion。

## 源码

- 协议：`spec/components/spin.spec.json`
- React：`packages/react/src/spin.tsx`
- Vue：`packages/vue/src/spin.ts`
