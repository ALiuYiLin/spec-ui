# Alert

警告提示。一条带语义色彩的横幅，可关闭。

## 代码演示

:::demo 四种语义类型，通过 `type` 切换，颜色与图标随之变化。
  <SmAlert type="info" message="这是一条提示信息" />
  <SmAlert type="success" message="操作成功" />
  <SmAlert type="warning" message="请检查输入" />
:::

## 结构

| 槽位 | 类名 | 说明 |
|---|---|---|
| 根 | `sm-alert` | 必填 |
| message | `sm-alert__message` | 必填 |
| description | `sm-alert__description` | 可选 |
| close | `sm-alert__close` | 可选 |

## 状态

| 属性 | 取值 |
|---|---|
| `type` | `success` `info` `warning` `error` |

## 不变量

- root 必须带 role="alert"。
- message 必须存在且只出现一次。
- close 若存在必须是 button，且位于最后。
- 语义类型只由 data-type 决定。

## 源码

- 协议：`spec/components/alert.spec.json`
- React：`packages/react/src/alert.tsx`
- Vue：`packages/vue/src/alert.ts`
