# 状态词汇表

> 版本 v0.1 · 适用于所有 SpecMark 组件协议
> 本文档是**封闭词汇表**：协议文件只能使用这里出现的词条与值域。新增词条需走第 10 节流程。

## 0. 为什么需要它

组件协议里最容易被随手发明的就是"状态"。Button 写 `data-loading`、Spin 写 `data-spin`、
Select 写 `data-busy`，样式层就永远在写特例，协议也就退化成了别名表。

词汇表同时规定**每个状态用什么机制承载**。这一点比词汇本身更重要：如果协议只说"要有 hover 态"，
A 实现用 `:hover`、B 实现用 `.is-hover`，样式层就无法写一份通用 CSS。**协议必须锁机制，不能只锁词汇。**

## 1. 术语

| 术语 | 含义 |
|---|---|
| 根（root） | 组件对外唯一入口节点，持有 `sm-<component>` 类名 |
| 部件（part） | 根内部的具名槽位，持有 `sm-<component>__<part>` 类名 |
| 语义所有者（owner） | 状态的语义归属方，状态属性只挂在它身上 |
| 镜像（mirror） | portal 脱离根子树时，从根复制过来的状态属性 |
| 值域（domain） | `data-state` 允许取值的封闭集合 |

## 2. 五类载体

| 载体 | 用于 | 可枚举 | 例子 |
|---|---|---|---|
| 伪类 | 交互态 | 否（浏览器驱动） | `:hover` `:active` `:focus-visible` |
| 原生属性 | 表单语义与行为 | 是 | `disabled` `checked` `readonly` `required` |
| `data-state` | 互斥的生命周期/选择态 | 是（每部件一个值域） | `data-state="open"` |
| `data-<flag>` | 正交布尔开关 | 是 | `data-disabled="true"` |
| `data-<variant>` | 配置变体 | 是（组件内封闭） | `data-size="sm"` |

两条铁律：

- **原则 A（样式钩子唯一）**：同一语义不得出现两个样式钩子。有 `data-disabled` 就不能再叠加 `is-disabled`。
- **原则 B（语义与钩子分离）**：原生属性承担行为与可访问性，`data-*` 承担样式；两者可以并存，但必须同时出现且一致，由一致性测试校验。

## 3. 交互态（强制伪类）

| 态 | 载体 | 说明 |
|---|---|---|
| hover | `:hover` | 指针悬停。触摸设备不触发，协议不要求等价表现 |
| press | `:active` | 指针按下期间。原生 `button` 在键盘 Space 按下时自动具备 |
| focus | `:focus` | 获得焦点 |
| focus-visible | `:focus-visible` | 键盘或程序化焦点需要可见指示时 |
| focus-within | `:focus-within` | 后代获得焦点、容器需要反馈时（如 Select 的 control 框） |

规则：

- 禁止用 JS 维护 hover / active / focus 类名；"延迟 hover"用 CSS `transition-delay` 或 `@media (hover: hover)` 实现。
- 交互态不产生 `data-*`，因此**不参与状态矩阵的笛卡尔积**，抓取时由 CDP `CSS.forcePseudoState` 派生。
- 某个部件是否支持某交互态，由组件协议的 `interaction` 字段声明；未声明即视为不保证。
- `focus-within` 是 v0.2 新增词条：Select 这类"容器 + 内部 input"的结构，焦点落在 input 上，
  但视觉反馈必须给容器。antd 的做法是 JS 加 `ant-select-focused` 类——正是本协议要禁止的机制。

## 4. 布尔状态（正交，可叠加）

| 词条 | 含义 | 样式钩子 | 语义属性 | 适用部件 |
|---|---|---|---|---|
| disabled | 不可交互 | `data-disabled="true"` | 表单控件用原生 `disabled`；非表单用 `aria-disabled="true"` | 根、条目 |
| readonly | 可聚焦但不可编辑 | `data-readonly="true"` | 原生 `readonly`；非表单用 `aria-readonly="true"` | 输入类 |
| required | 必填 | `data-required="true"` | 原生 `required` / `aria-required="true"` | 表单控件 |
| invalid | 校验失败 | `data-invalid="true"` | `aria-invalid="true"` | 表单控件容器 |
| loading | 进行中 | `data-loading="true"` | `aria-busy="true"` | 根 |
| selected | 已选中（非互斥语义，可多选） | `data-selected="true"` | `aria-selected="true"` | option、tab、row |
| highlighted | 键盘或指针高亮 | `data-highlighted="true"` | 无（由 `aria-activedescendant` 指向） | option、menuitem |
| pressed | 开关式按下态 | `data-pressed="true"` | `aria-pressed="true"` | toggle button |
| dragging | 拖拽进行中 | `data-dragging="true"` | 无（`aria-grabbed` 已废弃） | 可拖拽项 |
| placeholder | 当前显示占位内容 | `data-placeholder="true"` | 无 | 输入、选择器 |
| empty | 内容为空 | `data-empty="true"` | 无 | 列表、表格、上传 |

`loading` 与 `disabled` 是两件事，禁止互相代替：loading 期间元素通常仍可聚焦（并带 `aria-busy`），
只有业务上真正不可交互时才输出 disabled。

## 5. 互斥状态（`data-state`）

一个部件**最多**一个 `data-state`，值域由组件协议用 `domain` 字段声明：

| 值域名 | 合法值 | 典型部件 | aria 映射 |
|---|---|---|---|
| visibility | `open` \| `closed` | 浮层根、折叠触发器、抽屉 | `aria-expanded`（触发器）/ 浮层根通常不映射 |
| selection | `checked` \| `unchecked` \| `indeterminate` | checkbox、树节点、表头全选 | `aria-checked`（indeterminate → `"mixed"`） |
| toggle | `on` \| `off` | switch、分段控件项 | `aria-checked`（`role="switch"`） |
| radio | `checked` \| `unchecked` | radio | `aria-checked` |

禁止跨值域混用（不存在 `data-state="open checked"`）。需要同时表达"打开"和"选中"时，
一个用 `data-state`，另一个用布尔词条（如 `data-selected="true"`）。

## 6. 配置变体（生命周期内稳定）

| 词条 | 合法值 | 说明 |
|---|---|---|
| `data-variant` | 组件自定义封闭集 | 视觉变体，如 `primary` / `default` / `dashed` / `text` / `link` |
| `data-size` | `xs` `sm` `md` `lg` `xl` | 组件可收窄，不得扩展 |
| `data-shape` | `default` `round` `circle` `square` `pill` | |
| `data-tone` | `neutral` `primary` `success` `warning` `danger` `info` | 装饰性色意图 |
| `data-status` | `default` `success` `warning` `error` | 业务校验结果。与 tone 分开：tone 是"我想要什么颜色"，status 是"系统判定什么结果" |
| `data-orientation` | `horizontal` `vertical` | |
| `data-side` | `top` `right` `bottom` `left` | 浮层相对触发器的方位 |
| `data-align` | `start` `center` `end` | 浮层对齐方式 |

**取值必须有界且封闭。** 禁止把用户输入、id、索引、任意字符串放进 `data-*`：CSS 无法枚举，
而且会把业务数据泄漏进选择器生态。

## 7. 归属与继承

- 语义状态挂在**语义所有者**上（Select 根拥有 `visibility`，option 拥有 `selected` / `highlighted`）。
- 后代部件不重复标注，样式层用"所有者 → 后代"的后代选择器继承：

  ```css
  .sm-select[data-state="open"] .sm-select__arrow { transform: rotate(180deg); }
  ```

- **例外（portal 镜像）**：渲染到 `body` 的浮层脱离了根子树，后代选择器够不到，
  因此浮层根必须自带必要状态，且必须在组件协议里用 `mirror` 字段**显式列出**要镜像的键。
  镜像只允许发生在 portal 边界，不得作为常规做法——多份拷贝必然产生同步 bug。

## 8. 状态优先级

多个状态同时成立时，视觉权重从高到低：

1. `disabled` / `readonly`（不可交互压倒一切）
2. `loading`
3. `data-status="error"`
4. `data-status="warning"`
5. `:focus-visible`（焦点环，可访问性指示）
6. `:active`
7. `:hover`
8. `data-state`（选中、展开等持久态）
9. 变体（`data-variant` / `data-size` / `data-shape` / `data-tone`）
10. 基础样式

对应样式层的层叠顺序（后声明的层优先）：

```css
@layer av.base, av.variant, av.state, av.interaction, av.status, av.loading, av.disabled;
```

注意 `readonly` 可聚焦：它落在 `av.disabled` 层，若该层做了"去焦点环"处理，必须在这一层内显式恢复焦点环。

## 9. 禁止清单

- ❌ `is-*` / `has-*` 状态类
- ❌ 用内联 `style` 表达状态
- ❌ `data-*` 承载无界值
- ❌ 用 `aria-*` 当样式钩子（aria 是给辅助技术的；样式一律用 `data-*`，两者由一致性测试对齐）
- ❌ 同一语义两个钩子
- ❌ 组件私有状态词条（未进本表的）
- ❌ 在样式里依赖 DOM 层级深度（呼应协议"只承诺槽位不变量"的决策）
- ❌ 把 hover 等交互态写成属性或类名

## 10. 新增词条的流程

提案必须包含：语义定义、载体类别、合法值、aria 映射、**至少两个组件的复用场景**、与已有词条的差异说明。
评审通过后升 minor 版本，并同步更新 `protocol.schema.json` 中 `kind` 与 `domain` 的合法取值。
