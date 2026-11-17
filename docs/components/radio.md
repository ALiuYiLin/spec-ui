# Radio

单选框。结构与 Checkbox 同构，但选中态用 `radio` 值域。

## 代码演示

<Demo note="同一组必须共享 name，互斥由浏览器保证">
  <SmRadio label="未选" name="demo" />
  <SmRadio :model-value="true" label="已选" name="demo" />
  <SmRadio :disabled="true" label="禁用" name="demo" />
</Demo>

## 结构

| 槽位 | 类名 | 说明 |
|---|---|---|
| 根 | `sm-radio` | `<label>`，持有 `data-state` |
| 控制 | `sm-radio__control` | 16×16 定位容器 |
| 输入 | `sm-radio__input` | 原生 radio，`opacity: 0` 但可聚焦 |
| 圆点 | `sm-radio__box` | 纯视觉，`aria-hidden`，选中标记由 `::after` 绘制 |
| 文本 | `sm-radio__label` | 可选 |

## 状态

| 属性 | 取值 |
|---|---|
| `data-state` | `checked` `unchecked`（`radio` 值域） |
| `data-disabled` | 布尔 |

方向键在组内切换由浏览器原生行为提供，实现不得拦截。

## 视觉基线

| 项 | 值 |
|---|---|
| 圆点 | 16×16、`border-radius: 50%`、边框 `#D9D9D9` |
| 已选 | 底色与边框转 `#1677FF`，内部 6×6 白点 |
| 悬浮 | 边框转 `#1677FF` |
| 禁用 | 底色 `rgba(0,0,0,.04)`，文字 `rgba(0,0,0,.25)` |
| 焦点 | `outline: 3px solid #91CAFF` + `offset 1px`（作用在圆点上） |

## 源码

- 协议：`spec/components/radio.spec.json`
- React：`packages/react/src/radio.tsx`
- Vue：`packages/vue/src/radio.ts`
