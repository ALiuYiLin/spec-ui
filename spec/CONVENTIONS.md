# 命名与机制约定

> 与 `STATE-VOCAB.md` 配套。状态词汇定义"有哪些状态"，本文定义"状态与结构如何落到 DOM 上"。

## 1. 类名只管结构

| 层级 | 形式 | 例子 |
|---|---|---|
| 根 | `av-<component>` | `av-btn` `av-select` `av-input` |
| 部件 | `av-<component>__<part>` | `av-btn__label` `av-select__option` |

类名**只**承担结构钩子：不承载状态、不承载变体、不承载尺寸。

禁止：

- `av-btn-primary`（变体进类名 → 组合爆炸）
- `av-btn--primary`（BEM modifier，同上）
- `is-loading` / `has-error`（状态进类名）
- 同一节点挂两个组件域（`av-btn av-link`）

## 2. `data-*` 的命名与取值

- 键名与值一律小写 kebab-case：`data-variant="primary"`、`data-tone="danger"`。
- **布尔：为真时输出 `="true"`，为假时移除属性**，绝不写 `="false"`。
  原因：CSS 的 `[data-x]` 只判断属性存在，写 `"false"` 会让"存在即生效"的选择器集体误判。
- 枚举：值必须来自组件协议声明的封闭集合。
- 一个部件最多一个 `data-state`，且必须声明 `domain`。

## 3. 机制强制

| 语义 | 必须使用 | 禁止 |
|---|---|---|
| 交互反馈 | `:hover` `:active` `:focus` `:focus-visible` | JS 增删类名、`data-hover` |
| 禁用于表单控件 | 原生 `disabled` + `data-disabled="true"` | 只用 `aria-disabled` |
| 禁用于非表单部件 | `aria-disabled="true"` + `data-disabled="true"` | 只用 CSS `pointer-events` 假装禁用 |
| 选中（表单控件） | 原生 `checked` / `indeterminate` + `data-state` | 只用 aria |
| 选中（列表项） | `data-selected="true"` + `aria-selected` | 修改文字表达选中 |
| 浮层 | portal 到 `body` + `mirror` 显式声明镜像键 | 依赖根子树的后代选择器 |

## 4. 选择器规则

协议只承诺**槽位不变量**（存在、顺序、包含关系），不承诺中间层级。因此样式层只能依赖
"根类名 / 部件类名 / data-*"：

```css
/* ✅ 允许 */
.av-btn__label { line-height: 1.5715; }
.av-btn[data-loading="true"] .av-btn__label { opacity: .65; }
.av-select[data-state="open"] .av-select__arrow { transform: rotate(180deg); }
.av-select__option[data-highlighted="true"] { background: var(--av-color-fill-secondary); }

/* ❌ 禁止 */
.av-btn > span { }              /* 依赖层级与标签 */
.av-btn span:nth-child(2) { }   /* 依赖节点顺序 */
.ant-btn { }                    /* 依赖特定实现的内部分支 */
```

唯一例外：组件协议在 `invariants` 里显式声明了"直接子节点"关系时，允许 `>` 精确匹配（如 Button 的 icon / spinner）。

## 5. 结构不变量的写法

必须可判定、可转成机器断言：

```text
✅ "icon 若存在，是 root 的直接子节点，且位于 label 之前。"
✅ "label 必须存在且只出现一次。"
✅ "data-loading=\"true\" 时 spinner 存在，且 icon 不存在。"
❌ "结构应与 antd 保持一致。"
❌ "布局要合理。"
```

## 6. 可访问性映射

| 协议标记 | 语义属性 |
|---|---|
| `data-disabled="true"` | 表单控件：原生 `disabled`；非表单：`aria-disabled="true"` |
| `data-invalid="true"` | `aria-invalid="true"` |
| `data-loading="true"` | `aria-busy="true"` |
| `data-state="open"` | 触发器 `aria-expanded="true"` |
| `data-state="checked"` | `aria-checked="true"`（indeterminate → `"mixed"`） |
| `data-selected="true"` | `aria-selected="true"` |
| `data-pressed="true"` | `aria-pressed="true"` |

`aria-*` 与 `data-*` 不得互相替代：前者面向辅助技术，后者面向样式层，两者由一致性测试对齐。

## 7. 完整示例：Button

**默认态**

```html
<button type="button" class="av-btn"
        data-variant="primary" data-size="md" data-shape="default">
  <span class="av-btn__icon" aria-hidden="true"><!-- svg --></span>
  <span class="av-btn__label">提交</span>
</button>
```

**hover / active / focus-visible**

DOM 与默认态**完全一致**，零新增属性、零新增类名。差异只存在于伪类规则中。
这正是"状态不能只靠 DOM 表达"的证据——采集时必须同时取 computed style。

**加载态**

```html
<button type="button" class="av-btn"
        data-variant="primary" data-size="md" data-loading="true"
        aria-busy="true">
  <span class="av-btn__spinner" aria-hidden="true"><!-- spinner --></span>
  <span class="av-btn__label">提交</span>
</button>
```

**禁用态**

```html
<button type="button" class="av-btn"
        data-variant="primary" data-size="md" data-disabled="true"
        disabled>
  <span class="av-btn__label">提交</span>
</button>
```

**圆形（无可见文本）**

```html
<button type="button" class="av-btn"
        data-variant="text" data-size="md" data-shape="circle"
        aria-label="搜索">
  <span class="av-btn__icon" aria-hidden="true"><!-- svg --></span>
  <span class="av-btn__label">搜索</span>  <!-- 视觉隐藏，非 display:none -->
</button>
```

最后一条是刻意的：`circle` 仍保留 label 槽位（供辅助技术读取），视觉上裁掉。
这样协议不必为"无文本按钮"开特例，`aria-label` 只作为兜底。

## 8. 三层校验

| 层 | 对象 | 手段 | 阶段 |
|---|---|---|---|
| L1 协议合法 | `spec/**/*.json` | JSON Schema（`protocol.schema.json`） | 立即 |
| L2 实现一致 | 任一实现输出的 DOM | Playwright 跑同一状态矩阵，断言 `invariants` + data 集合 + 原生属性镜像 | 实现层落地时 |
| L3 视觉一致 | 计算样式 | 白名单属性 diff（主）+ 截图 SSIM（辅） | 样式层阶段 |

L2 是这套方案能否成立的关键：没有它，"协议"只是一份会过期的文档。
它与实现框架无关——任何能输出 DOM 的实现都能被同一套断言检查。

## 9. 组件缩写表

新组件写入协议前先在此登记，避免 `button` / `btn` 混用。

| 组件 | 前缀 | 组件 | 前缀 |
|---|---|---|---|
| Button | `av-btn` | Table | `av-table` |
| Input | `av-input` | Tabs | `av-tabs` |
| InputNumber | `av-input-number` | Modal | `av-modal` |
| Select | `av-select` | Drawer | `av-drawer` |
| Checkbox | `av-checkbox` | Tooltip | `av-tooltip` |
| Radio | `av-radio` | Popover | `av-popover` |
| Switch | `av-switch` | Dropdown | `av-dropdown` |
| Slider | `av-slider` | Menu | `av-menu` |
| Form | `av-form` | Tree | `av-tree` |
| Field | `av-field` | Upload | `av-upload` |
| DatePicker | `av-date-picker` | Pagination | `av-pagination` |
| Alert | `av-alert` | Tag | `av-tag` |
| Badge | `av-badge` | Card | `av-card` |
| Space | `av-space` | Spin | `av-spin` |
| Progress | `av-progress` | Skeleton | `av-skeleton` |
| Breadcrumb | `av-breadcrumb` | Steps | `av-steps` |
| Collapse | `av-collapse` | Avatar | `av-avatar` |
| Divider | `av-divider` | Empty | `av-empty` |
| Descriptions | `av-descriptions` | Timeline | `av-timeline` |
| Result | `av-result` | Image | `av-image` |
| Statistic | `av-statistic` | Transfer | `av-transfer` |
