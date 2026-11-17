# Progress

进度条。一条轨道加一段填充，填充宽度由百分比算出。

## 代码演示

::: demo
  <div style="width: 200px">
    <SmProgress :percent="40" />
    <SmProgress :percent="100" status="success" />
  </div>
:::

## 结构

| 槽位 | 类名 | 说明 |
|---|---|---|
| 根 | `sm-progress` | 必填 |
| rail | `sm-progress__rail` | 必填 |
| bar | `sm-progress__bar` | 必填 |
| text | `sm-progress__text` | 可选 |

## 状态

| 属性 | 取值 |
|---|---|---|
| `status` | `normal` `success` `exception` |

## 不变量

- rail 与 bar 必须存在且各出现一次，顺序为 rail → bar。
- bar 的宽度只能通过几何内联样式设置。
- root 必须带 role="progressbar"、aria-valuenow、aria-valuemin、aria-valuemax。

## 源码

- 协议：`spec/components/progress.spec.json`
- React：`packages/react/src/progress.tsx`
- Vue：`packages/vue/src/progress.ts`
