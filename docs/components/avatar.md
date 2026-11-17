# Avatar

头像。正方形或圆形的小容器，内容可以是文字或图标。

## 代码演示

<Demo>
  <SmAvatar label="用户">U</SmAvatar>
  <SmAvatar shape="square" label="用户">U</SmAvatar>
  <SmAvatar size="sm" label="小">S</SmAvatar>
  <SmAvatar size="lg" label="大">L</SmAvatar>
</Demo>

## 结构

没有部件——只有一个根节点，内容直接作为子节点。这是协议里第一个「空 parts」组件，
用来验证校验器不会因为缺 `parts` 报错。

## 状态

| 属性 | 取值 |
|---|---|
| `data-shape` | `circle` `square` |
| `data-size` | `sm` `md` `lg` |

## 视觉基线

| 项 | 值 |
|---|---|
| 尺寸 | 32 / 24 / 40 |
| 字体 | 14 / 12 / 18 |
| 圆角 | 50%（circle）或 6px（square） |
| 底色 | `rgba(0,0,0,.25)`，白字 |
| 溢出 | `hidden` |

`overflow: hidden` 很容易漏——文字稍长就会溢出头像圈外。

## 源码

- 协议：`spec/components/avatar.spec.json`
- React：`packages/react/src/avatar.tsx`
- Vue：`packages/vue/src/avatar.ts`
