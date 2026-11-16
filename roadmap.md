# SpecMark 组件路线图

> 更新于 Radio / Switch 开工时。当前：**4 个组件已完成**（Button、Select、Input、Checkbox），
> React 与 Vue 两套实现，同一套 L2 / L3 校验。

## 一个组件的完成定义（DoD）

每加一个组件，下面七项缺一不可：

| # | 产出 | 位置 |
|---|---|---|
| 1 | 组件协议 | `spec/components/<name>.spec.json` |
| 2 | React 实现 | `packages/react/src/<name>.tsx` |
| 3 | Vue 实现 | `packages/vue/src/<name>.ts` |
| 4 | antd 证据矩阵 | `playground/react-antd/src/matrix/<name>.tsx` |
| 5 | 两套实现的用例 | `src/ref/cases.tsx`、`src/vue/cases.ts` |
| 6 | Tailwind 样式 | `packages/css/src/styles.css` |
| 7 | L3 pair + 文档页 | `scripts/visual-diff.mjs`、`docs/components/<name>.md` |

验收：`pnpm typecheck` 0 错误、`pnpm verify` 两套实现全绿。

## 已完成

- [x] Button
- [x] Select
- [x] Input
- [x] Checkbox

## A 档：表单控件族（5 个，最便宜）

复用 Checkbox 抽出的 `control` 部件与原生 input 结构。

- [x] Radio —— radio 值域落地
- [x] Switch —— toggle 值域落地
- [x] InputNumber —— spinbutton 语义在 wrap 上，文本型 input + 步进按钮

- [x] Slider —— geometry 字段落地；轨道与手柄走几何内联样式
- [x] Tooltip —— 触发器/浮层分离；data-side 落地





- [x] Dropdown —— menu/menuitem 最小语义；aria-expanded
- [x] Field —— 表单项壳；L3 只比 label（antd 的 Form.Item 有多层包裹）

## B 档：展示类（18 个，机械但量大）

Divider、Space、Card、Tag、Badge、Avatar、Alert、Progress、Spin、Skeleton、
Empty、Result、Statistic、Image、Breadcrumb、Steps、Timeline、Descriptions

几乎不新增词汇，主要是槽位不变量 + 现有变体（`data-tone`、`data-orientation`）。
适合一次铺 5–8 个。

## C 档：浮层族（5 个）

Tooltip、Popover、Dropdown、Modal、Drawer

复用 Select 已打通的 portal / `mirror` / 几何内联样式。新增 `data-side`、`data-align`。
Modal / Drawer 的焦点陷阱属于行为，不进 DOM 契约。

## D 档：复杂状态族（10 个，每个单独立项）

| 组件 | 预判压力 |
|---|---|
| Tabs、Collapse | 低，`visibility` + `data-selected` 够用 |
| Pagination | 中，当前页与省略号槽位 |
| Menu | 中高，层级展开的归属 |
| Tree | 高，层级 + 展开 + 选中 + 半选 |
| Table | 高，大概率新增 `data-sort` |
| Upload | 中高，`data-dragging`（已定义未用）+ 进度 |
| Transfer | 中高，双列表选中集合 |
| DatePicker | 高，日历网格 + `aria-activedescendant` 第二处用法 |
| Form | 高，跨组件布局协议 |

## 词汇表里还没被用到的词条

| 词条 | 等谁用 |
|---|---|
| `data-state: radio` / `toggle` | Radio / Switch |
| `data-side` / `data-align` | Tooltip / Popover |
| `data-dragging` | Upload |
| `data-empty` | Empty / Table |
| `data-orientation` | Slider / Tabs / Descriptions |
| `data-tone` | Tag / Badge / Alert |

Radio 与 Switch 做完后，`data-state` 的四个值域就全部被使用过了。

## 顺序建议

1. **A 档收尾**（Radio、Switch、Field、InputNumber、Slider）
2. **C 档打通**（Tooltip 先行，其余复制）
3. **B 档批量**
4. **D 档逐个单独立项**

每完成一档，回看 `spec/FINDINGS.md`，把被实现倒逼出来的协议修正记下来。
