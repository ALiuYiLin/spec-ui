# Empty

空状态。一张占位插图加一句说明。

## 代码演示

<Demo>
  <SmEmpty />
</Demo>

## 结构

| 槽位 | 类名 | 说明 |
|---|---|---|
| 根 | `sm-empty` | 必填 |
| image | `sm-empty__image` | 必填 |
| description | `sm-empty__description` | 必填 |

## 状态

| 属性 | 取值 |
|---|---|
| — | 无 |

## 不变量

- image 与 description 必须存在且各出现一次，顺序为 image → description。
- 插图是装饰性的，必须 aria-hidden。
- 说明文案不得为空。

## 源码

- 协议：`spec/components/empty.spec.json`
- React：`packages/react/src/empty.tsx`
- Vue：`packages/vue/src/empty.ts`
