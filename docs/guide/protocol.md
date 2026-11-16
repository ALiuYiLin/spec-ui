# 协议分层

SpecMark 不是一套组件，而是一份**可以被机器校验的 DOM 契约**。

## 为什么需要协议

组件库通常把三件事捆在一起：结构、样式、框架。结果是换主题要改实现、换框架要重写样式。

SpecMark 把它们拆成三层，只有协议是对外契约：

```
协议 (spec/)  ──►  实现 (React / Vue / …)  ──►  DOM
   │
   └────────────►  样式 (Tailwind)
```

## 三条铁律

### 1. 类名只管结构

- 根：`sm-<component>`，如 `sm-btn`
- 部件：`sm-<component>__<part>`，如 `sm-btn__label`

类名**不**承载状态、不承载变体。`sm-btn--primary`、`is-loading` 都是非法的。

### 2. 状态一律 `data-*`

| 载体 | 例子 | 用途 |
|---|---|---|
| `data-state` | `data-state="open"` | 互斥的生命周期/选择态 |
| 布尔 | `data-disabled="true"` | 正交开关（为假时**移除属性**，不写 `false`） |
| 变体 | `data-variant="primary"` | 封闭枚举 |
| 伪类 | `:hover` `:focus-visible` | 交互态，禁止用 JS 类名 |

`data-state` 只有四个值域：`visibility`、`selection`、`toggle`、`radio`。跨值域混用是不允许的。

### 3. 结构只承诺槽位不变量

协议说"icon 若存在，必是 root 的直接子节点且在 label 之前"，不说"root > span > svg"。

因此样式层禁止 `.sm-btn > span` 这类深层选择器——只允许类名与属性选择器。

## 怎么验证

| 层 | 对象 | 手段 | 结果 |
|---|---|---|---|
| L1 | 协议文件本身 | JSON Schema | 通过 |
| L2 | 实现输出的 DOM | 通用规则 + 声明式断言 | 40/40 |
| L3 | 计算样式 | 与 antd 证据逐属性比对 | 70/70 |

L2 的通用规则由协议推导，不认框架：类名封闭、`data-*` 必须声明、布尔只能为 `"true"`、
`aria` 与 `data` 一一对应、`aria-controls` 必须指向真实节点、禁止内联 `style`（portal 几何除外）。

L3 拿 antd 的真实渲染结果当基线，比 88 项计算样式，容差 0.6px / 1 个色阶。

## 一个例子

同一个 Button，两套实现输出完全相同的 DOM：

```html
<button class="sm-btn" data-variant="primary" data-size="md" data-shape="default"
        data-loading="true" aria-busy="true">
  <span class="sm-btn__spinner" aria-hidden="true"><svg>…</svg></span>
  <span class="sm-btn__label">提 交</span>
</button>
```

React 与 Vue 的产物逐字节相同，样式只需认得这套类名。
