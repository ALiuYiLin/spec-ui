# Image

图片。一个带圆角与占位底色的图片容器。

## 代码演示

<Demo>
  <SmImage
    src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    :width="40"
    alt=""
  />
</Demo>

## 结构

| 槽位 | 类名 | 说明 |
|---|---|---|
| 根 | `sm-image` | 必填 |
| img | `sm-image__img` | 必填 |

## 状态

| 属性 | 取值 |
|---|---|---|
| — | 无 |

## 不变量

- img 必须存在且只出现一次，且必须是 root 的直接子节点。
- img 必须带 alt（装饰性图片用空字符串）。
- 圆角与底色在 root 上，不在 img 上。

## 源码

- 协议：`spec/components/image.spec.json`
- React：`packages/react/src/image.tsx`
- Vue：`packages/vue/src/image.ts`
