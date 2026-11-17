# 协议分层

SpecMark 不是一套组件，而是一份**可以被机器校验的 DOM 契约**。

## 为什么需要协议

组件库通常把三件事捆在一起：结构、样式、框架。结果是换主题要改实现、换框架要重写样式。

SpecMark 把它们拆成三层，只有协议是对外契约：

```
协议 (spec/)  ──►  实现 (React / Vue / …)  ──►  DOM
   │
   └────────────►  样式 (Sass → PostCSS → index.css)
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

## 结构等价，而不是同一棵树

不同实现**不必产出同一棵 DOM 树**。协议约束的是「相对结构」：

- 部件在谁的子树里（祖先，不是固定父子）
- 同一条行里的部件顺序与互斥
- 部件的**直接父元素**必须是哪种布局
- 中间允许插入「透明包裹」

Input 的关系约束长这样：

```json
"prefix": {
  "class": "sm-input__prefix",
  "requires": {
    "inside": "root",
    "lane": { "name": "affix-row", "order": 1 },
    "parent": { "layout": "flex-row", "align-items": "normal" }
  },
}
```

四个字段各管一件事：

| 字段 | 含义 | 校验方式 |
|---|---|---|
| `inside` | 必须是该部件的后代（不承诺深度） | 沿 `parentUid` 链回溯 |
| `lane` | 同一行的成员，按 `order` 出现，`exclusiveWith` 互斥 | `seq` 文档序 + 祖先互斥检查 |
| `parent` | **直接父元素**必须满足的计算值 | 取父节点的 `display` / `flexDirection` / `alignItems` |

### 为什么「父级布局」写在子元素上

因为这样才允许实现插入容器。谁需要一行，谁就声明「我的父元素必须是 flex-row」；
如果实现凭空加了一层包裹，**这层包裹必须自己证明自己是 flex-row**，否则校验失败。

好处是报错直接指向违反约定的元素：*「clear 要求父级是 flex-row，实际 block/row」*。

### 透明包裹的定义

未声明的中间元素必须同时满足：没有 `sm-` 类名、没有 `data-*` / `aria-*` / `role` / `tabindex`、
不承载文本。它在 DOM 里存在，但对语义、状态与可访问性树没有贡献。

### 尺寸不写进协议

尺寸属于 CSS 层的职责：组件库用自己的令牌体系（`--sm-*`）按 `sm/md/lg` 定义，
协议只约束结构与关系。尺寸是否与参考实现一致，由 L3 拿计算样式逐项比对——那是几何问题，
用几何的方式验证，比在协议里抄一份数字更可靠。

### 五条负向测试

改错协议，校验器必须报红（全部验证过）：

1. lane 顺序写反
2. 父级布局写成 `flex-column`
3. `inside` 指向错误的同级部件
4. `inside` 指向协议里不存在的部件

（尺寸不由协议承载，因此没有「令牌改错」这一项。）

### 边界

- `attach: "body"` 的部件（portal 浮层）跳过 `inside` / `lane` 的容器校验，改验父节点是 `body`
- `many: true` 的集合部件（如 option）逐个校验，不校验数量
- `forms` 表达根的多种形态（Input 的 `input` / `span`），不存在形态不参与校验

## 关系推断器

```bash
pnpm --filter @specmark/playground-react-antd run infer:relations -- --component=Tag --write
```

从 antd 证据反推 `requires` 草稿：跨用例一致的关系才写进 draft，不一致的进 `issues`；
部件映射来自 `visual-diff.mjs` 的 `RESOLVE`（那是「我们的部件 ↔ antd 类名」的唯一真相）。

用途是**减少手写量**，不是替代裁决：推断器给草稿，人判断哪些是契约、哪些是实现细节。
`draft`/`issues`/`diff` 三块分别对应「推出来的」「推断不了的」「与手写 spec 不一致的」。
