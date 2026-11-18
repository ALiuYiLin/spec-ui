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
部件映射来自仓库根的 `antd-map.json`（「我们的部件 ↔ antd 选择器」的唯一真相，`visual-diff` 与推断器共用）。

用途是**减少手写量**，不是替代裁决：推断器给草稿，人判断哪些是契约、哪些是实现细节。
`draft`/`issues`/`diff` 三块分别对应「推出来的」「推断不了的」「与手写 spec 不一致的」。

## 对齐 antd 结构的操作手册

把一个组件的结构对齐到 antd，按这个顺序做，别跳步。

### 1. 先把 antd 的真实层级和盒模型量出来

不要凭 antd 的类名猜结构。直接读证据里的树，带上 `display` / `flex-direction` / 宽高 / padding：

```bash
node -e "
const fs=require('fs');
const flat=(n,o=[],d=0)=>{o.push([n,d]);(n.children||[]).forEach(k=>flat(k,o,d+1));return o};
const r=JSON.parse(fs.readFileSync('artifacts/card/card-basic.json','utf8'));
for (const [n,d] of flat(r.tree)) {
  const c=(n.classes||[]).filter(x=>!x.startsWith('css-')).join('.');
  console.log('  '.repeat(d)+n.tag+'.'+c, n.rect.w+'x'+n.rect.h, n.style.display, n.style['flex-direction']);
}"
```

**几个反直觉的事实**（都是量出来的，不是读文档得来的）：

| 组件 | 反直觉之处 |
|---|---|
| Card | `head` 是 `flex-column`，`flex-row` 在下一层 `head-wrapper` 上 |
| Field | `flex-column` 在 `ant-row` 上；`control` 本身是 `block` |
| Field | 错误文案在 `additional > explain > explain-error` 三层里，全是 block |
| Breadcrumb | 根是 `block`，`flex-row` 在内层 `<ol>`；`item` 是 `li`（`list-item`） |
| Alert | 根是 `flex-row`，但 message 的父级是 `content`（block） |
| Timeline | 根是 `<ol>`，`li` 的 computed display 是 `list-item` |

### 2. 改结构前，先查有没有同名 CSS 规则

这是**最耗时的坑**，也是唯一一个 L3 抓不到的坑。

```bash
grep -n '^\.sm-<component>' packages/css/src/components/<component>.scss
```

`field.scss` 里曾经躺着两条实验遗留的规则：

```scss
.sm-field { display: flex; flex-direction: column; }
.sm-field__control { display: flex; flex-direction: column; }
```

它们让新写的 `display: block` 永远不生效。**L3 是绿的**（几何没变），
只有 L2 的「父级布局」断言会报红——所以看到「父级布局不符」而 CSS 明明写了，
第一反应应该是「是不是有旧规则在后面覆盖」。

### 3. 结构改动要 React / Vue 同步，断言也要跟着改

三处必须一起改，漏一处就是红的：

1. 组件实现（`packages/react/src/*.tsx` 与 `packages/vue/src/*.ts`）
2. 参考用例的断言（`playground/react-antd/src/ref/groups/*.tsx`）——
   父级变了，`childOf` 的目标也要变
3. `spec` 的部件清单与 `antd-map.json` 的映射

### 4. 用例内容也要对齐 antd，不只是结构

Card 卡了很久，最后发现**不是结构问题**：antd 的 `card-basic` 只有标题，
我们的参考用例多给了一个 `extra`，标题因此窄了 32px。

对比宽度类的差异时，先确认**两边渲染的内容是否一致**，再看 CSS。

### 5. 每改一层就跑一次验证，不要攒

```bash
node scripts/conformance.mjs --component=Card
node scripts/visual-diff.mjs --component=Card
```

攒到最后一起跑，出红时分不清是哪一层引入的。

### 6. 能用推断器验证就别手写

结构改完后重跑推断器，`diff` 为空说明我们的实现和 antd 的结构一致：

```bash
pnpm --filter @specmark/playground-react-antd run infer:relations -- --component=Card
```

### 7. 改错了就整体回滚，不要留半成品

半成品会破坏已经验证过的 L3 目标，而且下一次改动会分不清新旧问题。
`git checkout` 相关文件 + 删掉 spec/map 里新增的条目，比「修到能过」更快也更安全。

