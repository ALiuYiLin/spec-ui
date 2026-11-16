# Button 第一轮证据结论

> 采集对象：antd 5.29.3 / React 18.3.1 / Chromium 157.0.8103.51 / 1280×800 @1x / zh-CN
> 产物：`artifacts/button/`（26 个状态，27 个 JSON + 26 张 PNG，0.3 MB）
> 交互态通过 CDP `CSS.forcePseudoState` 强制，非点击模拟。

## 一、四个协议假设全部成立

| 假设 | 结果 | 证据 |
|---|---|---|
| 交互态必须靠强制伪类才拿得到 | ✅ | primary 的 hover 背景 `rgb(22,119,255)` → `rgb(64,150,255)`，DOM 与类名零变化 |
| `:focus` 与 `:focus-visible` 是两件事 | ✅ | 单独强制 `focus` 时样式零变化；`focus-visible` 才出现 outline |
| disabled 压制 hover | ✅ | `button-disabled` 与 `button-disabled-hover` 的根节点样式完全一致 |
| icon 与 spinner 互斥 | ✅ | `loading` 时用户传入的 icon 被丢弃，只剩 spinner |

这四条是上一轮"只留 DOM + 类名"方案里最容易出问题的地方，现在都有实测依据了。

## 二、证据里冒出来的、协议还没覆盖的东西

### 1. 焦点环只能用 outline

- 默认态：`outline-style: none`、`outline-width: 3px`、`outline-color` 跟随文字色 —— 看起来像有 3px 描边，其实是障眼法。
- 焦点态：`outline-style: solid`、`outline-width: 3px`、`outline-color: rgb(145,202,255)`、`outline-offset: 1px`。

**结论**：只检查 `outline-width` 会误判所有状态都有焦点环，必须同时看 `outline-style`。
协议需要一条机制条款：**焦点环必须用 outline 实现，禁止 box-shadow**——box-shadow 在
`forced-colors` 高对比模式下会被系统丢弃，而且会被祖先的 `overflow: hidden` 裁掉。

### 2. 两个汉字的文案会被自动插空格

`"提交"` 被渲染成 `"提 交"`（中间一个 U+0020），按钮宽度 63.84px。
规则实测：label 恰好两个汉字、且**未传 icon** 时生效；传了 icon 就不插（`button-icon` 的 ownText 是 `"搜索"`）。

**结论**：这是 DOM 文本层面的改写，不写进协议，两个实现会天然差 3.84px。
协议需要新增"文案规范化"条款。

### 3. disabled 是中性覆盖，不保留变体色

`primary + disabled` 的背景是 `rgba(0,0,0,0.04)`，不是主色；文字 `rgba(0,0,0,0.25)`；
边框退回 `rgb(217,217,217)`；阴影移除；`cursor: not-allowed`。

**结论**：禁用态与 `data-variant` 正交，协议应写明"disabled 覆盖变体色"，否则实现会各自发挥。

### 4. 元素上带构建哈希类

根节点类名实测：`ant-btn css-7zmxdp ant-btn-primary ant-btn-color-primary ant-btn-variant-solid`。
`css-7zmxdp` 是 cssinjs 的构建哈希，换一次构建就变。

**结论**：归一化必须剥离，且再次证明"类名不可作为协议"。

### 5. antd 自己的类名体系也在演进

v5.29 已经出现 `ant-btn-color-*` / `ant-btn-variant-*` / `ant-btn-icon-only` / `ant-btn-loading` 这套
拆分命名。把它当协议，等于把别人的内部重构变成你的 breaking change。

## 三、实测基线（CSS 层可直接用）

| 尺寸 | 高度 | 左右 padding | 圆角 | 字号 |
|---|---|---|---|---|
| sm | 24px | 7px | 4px | 14px |
| md | 32px | 15px | 6px | 14px |
| lg | 40px | 15px | 8px | 16px |

`round` 的圆角等于自身高度（md = 32px）；`circle` 是 32×32、圆角 50%、padding 0；
`block` 宽度撑满容器（本次容器 256px）。

| 项 | 值 |
|---|---|
| primary | 底色 `#1677FF`，hover `#4096FF`，active `#0958D9`，阴影 `rgba(5,145,255,.1) 0 2px 0` |
| default / dashed | 底 `#FFFFFF`，边 `#D9D9D9`，hover 文字与边框转 `#4096FF`，阴影 `rgba(0,0,0,.02) 0 2px 0` |
| text | 无底色无边框；hover 底色 `rgba(0,0,0,.04)`；无阴影 |
| link | 无底色无边框；文字 `#1677FF`，hover `#69B1FF`；无阴影 |
| danger | 底色 `#FF4D4F`；阴影 `rgba(255,38,5,.06) 0 2px 0` |
| disabled | 底 `rgba(0,0,0,.04)`，字 `rgba(0,0,0,.25)`，边 `#D9D9D9`，无阴影，`cursor: not-allowed` |
| 焦点环 | `outline: 3px solid #91CAFF`，`outline-offset: 1px` |

## 四、待拍板

1. **auto-space 复刻吗？** 复刻 = 完全对齐 antd 的宽度；不复刻 = 少 3.84px，但文案是"所见即所得"。
2. **焦点环锁 outline 写进协议吗？** 我建议写，理由见第 1 条。
3. **disabled 是否允许"禁用但保留主色"？** 有些设计系统需要弱化而非灰化。我建议默认中性，需要时用 `data-tone` 显式表达。

## 五、下一步

见下方第二轮。Select 已经跑完，词汇表通过了一处、被打穿了一处。

---

# Select 第二轮证据结论

> 采集对象同上：antd 5.29.3 / Chromium 157.0.8103.51 / 1280×800 @1x
> 产物：`artifacts/select/`（16 个状态，含 clear 的对照用例）

## 一、词汇表的两处压力测试

| 压力点 | 结果 |
|---|---|
| option 同时"已选中"且"键盘高亮" | ✅ 两个布尔 `data-selected` / `data-highlighted` 就够，不需要给 `data-state` 加值域 |
| 容器要反映内部 input 的焦点 | ❌ 词汇表缺词 → 新增 `focus-within`（v0.2） |

第二条的反证很直接：antd 根本不写 `:focus-within`，而是 JS 加 `ant-select-focused` 类。
这正是协议要禁止的机制——所以词汇表必须补上这个词，否则实现只能学 antd 用类名。

## 二、三个必须写进协议的坑

### 1. option 在 antd 里有两份

浮层里的真实结构：

```html
<div role="listbox" id="rc_select_0_list">          <!-- a11y 镜像，高度 0 -->
  <div role="option" aria-selected="true">选项 B</div>
</div>
<div class="rc-virtual-list">                        <!-- 视觉层 -->
  <div class="ant-select-item ant-select-item-option ant-select-item-option-active ant-select-item-option-selected">
```

`role="option"` 的那三个节点是给 `aria-activedescendant` 用的空壳，**不是**你在屏幕上看到的项。
只按 `role` 抓，会抓到三个透明、无类名、高 0 的假节点——本轮第一次汇总就栽在这里。

**协议结论**：一个 option 一个节点，同时承担 role 与视觉。若将来做虚拟滚动被迫保留镜像，
镜像必须 `aria-hidden="true"` 且不得使用 `sm-select__option` 类名。

### 2. `aria-activedescendant` 会指向不存在的节点

`select-open-empty`（无选项）实测输出 `aria-activedescendant="rc_select_0_list_-1"`，
指向一个 id 为 `-1`、根本不存在的元素。

**协议结论**：无高亮项时必须移除该属性。这条我们比 antd 更严格，属于修正而非复刻。

### 3. clear 是"常驻但透明"，不是条件渲染

| 用例 | clear opacity | arrow opacity |
|---|---|---|
| 有值 + allowClear | 0 | 1 |
| 有值 + allowClear + hover | 1 | 1 |

antd 的 arrow 始终 opacity 1，靠 clear 的实心圆图标几何遮挡住箭头（clear 自身背景是透明的）。
视觉结果没问题，但协议不该依赖"遮挡"这种巧合。

**协议结论**：clear 常驻渲染、默认不可见；clear 可见时 arrow 必须不可见。二者共用右侧槽位。

## 三、同一套库里焦点有两种机制

| 组件 | 状态 | 机制 |
|---|---|---|
| Button | `:focus-visible` | `outline: 3px solid #91CAFF` + `offset 1px` |
| Select | `:focus-within` | control 边框转 `#1677FF` + `box-shadow: 0 0 0 2px rgba(5,145,255,.1)` |

这不算矛盾——前者是"键盘焦点环"，后者是"输入框激活态"，语义不同。
但协议必须分别写死，否则实现会把两者混成一个。

## 四、实测基线

| 项 | 值 |
|---|---|
| control（md） | 高 32 / 圆角 6 / 左右 padding 11 |
| control（sm / lg） | 高 24 圆角 4；高 40 圆角 8 |
| outlined | 底 `#FFFFFF`，边 `#D9D9D9` |
| hover | 边转 `#4096FF` |
| focus-within | 边转 `#1677FF` + 外发光 `0 0 0 2px rgba(5,145,255,.1)` |
| status=error / warning | 边 `#FF4D4F` / `#FAAD14` |
| disabled | 底 `rgba(0,0,0,.04)` |
| variant=filled | 底 `rgba(0,0,0,.04)`，边透明 |
| variant=borderless | 底透明，边透明 |
| dropdown | 底 `#FFFFFF`，圆角 8，padding 4，`z-index: 1050`，阴影 `0 6px 16px rgba(0,0,0,.08), 0 3px 6px -4px rgba(0,0,0,.12), 0 9px 28px 8px rgba(0,0,0,.05)` |
| option | 高 32，左右 padding 12，圆角 4，行高 22，字号 14 |
| option selected | 底 `#E6F4FF`，字重 600 |
| option highlighted | 底 `rgba(0,0,0,.04)` |
| clear | 12×12，绝对定位 `right: 11px` |

## 五、待拍板

1. **option 单节点 vs 虚拟滚动镜像**：我建议单节点是硬约束，虚拟滚动的镜像必须 `aria-hidden` 且不带协议类名。
2. **clear 遮挡 vs 隐藏 arrow**：我建议显式隐藏 arrow，不依赖几何遮挡。
3. **Select 的 `data-state` 是否也镜像给 dropdown**：已写进协议（`mirror: ["state"]`），确认无异议即可。

> 三条均已按建议采纳，落地结果见下一节。

---

# L2 一致性校验（第三轮）

> 这一轮的产出不是数据，而是**证明**：协议能不能被机器执行。

## 一、做了什么

| 产物 | 说明 |
|---|---|
| `packages/react/` | 参考实现，Button + Select，**零样式**，只输出协议 DOM |
| `playground/react-antd/ref.html` | 参考实现的受控用例台，用例自己声明断言 |
| `playground/react-antd/scripts/conformance.mjs` | 通用规则 + 声明式断言 + 自检模式 |

结果：**conformance 22/22 通过**，**selftest 7/7 通过**。

参考实现打包后 9.66 kB（gzip 2.88 kB），对比 antd 那份 324 kB——因为没有样式，也没有 rc-* 那一层。

## 二、通用规则（从 spec 推导，实现无关）

1. 根节点唯一，且标签符合 `spec.anatomy.root.tag`
2. 协议类名封闭：出现未声明的 `sm-*` 类即失败
3. 禁止 `is-*` / `has-*` 状态类，禁止 `ant-*` / `css-*` 外部类名
4. 禁止内联 `style`（样式不许借 DOM 夹带）
5. `data-*` 必须在协议中声明，布尔只能 `"true"`，枚举必须合法
6. 协议里标了 `required` 的 `data-*` 必须存在
7. `aria` 与 `data` 必须一一对应（disabled / invalid / loading / selected / pressed）
8. `aria-controls` / `aria-activedescendant` / `aria-owns` 必须指向真实存在的节点
9. `role="option"` 的节点数必须等于协议 option 节点数（禁止 ARIA 镜像）

第 9 条就是上一轮那个"两份 option"的直接反制——照抄 antd 的实现会立刻红。

## 三、这一轮改掉的三条协议条款

写完校验器才发现，有三条 invariant 根本没法机器判定：

| 原条款 | 问题 | 改成 |
|---|---|---|
| clear 默认不可见（opacity:0） | 可见性是 CSS，DOM 里看不出来 | "clear 在 allowClear 且有值时始终渲染" |
| clear 可见时 arrow 必须不可见 | 同上 | 挪到 `notes`，标注为样式层约束 |
| 焦点反馈必须由 `:focus-within` 驱动 | 无法直接断言"用了伪类" | 改成"禁止输出状态类名"，由第 2、3 条通用规则兜住 |

这不是文字游戏。`invariants` 是给机器看的，一旦写进不可判定的句子，它就退化成文档，
而文档会过期。**规矩：invariants 只放 DOM 可观察的断言，视觉归 L3。**

## 四、三个被真正验证的强约束

- **根节点标签**：Select 的根必须是 `div`，不是 `input`——可访问入口在内部的 input 上
- **icon / spinner 必须是 root 的直接子节点**：不能塞进 label 里面（selftest 专门测了这条）
- **dropdown 必须 portal 到 body**：这条同时保住了 z-index 与 overflow 语义

## 五、自检为什么必要

第一次跑就是 22/22 全绿。全绿有两种可能：实现对了，或者校验器什么都没查。

所以加了 7 个"故意写错"的夹具：状态类名、未声明 data、内联 style、缺 aria-busy、
ARIA 镜像 option、icon 嵌错层、浮层没 portal。每一个都必须被拒绝。
这一步把"通过"从"看起来对"变成了"有依据"。

## 六、还没覆盖的（属于 L3 或人工）

- hover / active / focus-visible 的视觉（参考实现没有样式，无从断言）
- clear 与 arrow 的叠放、焦点环用 outline 还是 shadow
- 颜色、间距、圆角等一切计算样式

## 七、结论

协议第一次被证明可执行：42 份证据 → 2 份协议 → 9 条通用规则 + 22 条用例，全部机器判定。

而且校验器不认识 React——Vue 或 Web Component 实现只要提供同样的用例表，跑的是同一套规则。

---

# L3 视觉一致性（第四轮）

> 目标：用 Tailwind 写 `sm-btn` / `sm-select`，证明"一份 CSS 能复刻 antd 的视觉"。

## 一、结果

| 指标 | 值 |
|---|---|
| 比对目标 | 27 个（组件部件 × 状态） |
| 每目标属性 | 88 项（共 90 项，跳过 2 项 transition） |
| 断言总数 | 2376 条 |
| 不一致 | **0** |

跳过的 2 项是 `transition-property/duration`：证据是在 `motion: false` 下采集的，antd 显式
`transition: none`，而我们保留真实过渡。比动画没有意义，还会淹没真正的视觉差异。

## 二、一个反直觉的发现：不能引 Tailwind 的 preflight

第一轮 diff 里每个子部件都在红，原因是 preflight 给所有元素加了
`box-sizing: border-box` 和 `border-style: solid`；而 antd 的 reset 只把 `border-box`
给控件根节点，label / option / placeholder 仍然是 `content-box` + `border: none`。

改成只引 `tailwindcss/theme.css` + `tailwindcss/utilities.css`，自己显式写 border 声明，
噪声立刻消失。

**结论**：组件库必须自带 reset，不能借框架的 preflight。这条不是风格偏好，是计算样式层面的硬约束。

## 三、三个只有逐属性比对才会暴露的细节

1. **option 必须是 flex item。**
   antd 的 option 在 `.rc-virtual-list-holder-inner`（flex）里，所以 `min-width` 的计算值是 `auto`；
   我们的 listbox 是 block，option 的 `min-width` 变成 `0px`。把 listbox 改成 `flex column` 才对齐。

2. **label / placeholder 是 content-box。**
   它们没有 padding，视觉上无差别，但计算值不同。这类"看不见的差异"只能靠属性比对抓。

3. **disabled 的 cursor 分两处。**
   根节点仍是 `pointer`，只有 control 是 `not-allowed`。这是 antd 自己的不一致；
   视觉一致优先，照抄并记录。

## 四、一个协议级修正：portal 允许几何内联样式

浮层宽度必须等于触发器宽度，而浮层已经脱离根子树，只能实测后写内联样式——这和
"禁止内联 style"直接冲突。

处理方式：协议新增 `portal: true` 字段。只有 portal 部件允许内联样式，且**只允许几何属性**
（width / height / left / top / transform 等）。校验器会解析 style 声明，任何视觉属性混入就报错。

## 五、已知缺口

| 缺口 | 归属 |
|---|---|
| 空态插图（antd 的 Empty 带 SVG 插画） | 内容资产，不属于样式层 |
| 图标 glyph（chevron / clear / spinner 目前是空盒子） | 内容层，下一步补 |
| hover / active / focus-visible 的视觉 | 已写好规则，但 diff 未覆盖（证据里的强制伪类态未纳入本批目标） |

## 六、结论

整条链路第一次闭合：

```
42 份证据 → 2 份协议 → 22 条 DOM 用例 + 7 条自检 + 2376 条样式断言
```

而且这份 CSS 是**照着协议 DOM 写的**，不是从 antd 源码抄的。协议不变，换一个 Vue 实现，
样式一行都不用改——这就是当初"协议先行"想要换到的东西。

---

# L3 补全：图标与交互态（第五轮）

## 一、结果

| 指标 | 上一轮 | 本轮 |
|---|---|---|
| L3 目标 | 27 | **46** |
| 样式断言 | 2376 | **4048**（46 × 88） |
| L2 用例 | 22 | 24 |
| 不一致 | 0 | 0 |

新增覆盖：spinner / arrow / clear 三个图标部件，以及 hover / active / focus-visible / focus-within
共 15 个交互态目标。

## 二、图标不是抄的，是从证据里生成的

`packages/react/src/icons.tsx` 里的三个 `path d` 不是手写的，而是从 `artifacts/` 里
antd 实际渲染出的 `<svg>` 节点提取后生成的。手抄一个路径少一位数字，就可能差半个像素，
而这类差异在对比时表现为"莫名其妙对不上"。

代价是图标与证据版本绑定：升级 antd 需要重新生成。这可以接受——图标的形状本来就该跟着基准走。

## 三、交互态需要和证据同一套强制机制

参考实现的 hover / active / focus-visible 是纯伪类，DOM 里没有任何痕迹。
所以 `visual-diff` 也必须用 CDP 的 `CSS.forcePseudoState` 在 ref 页上强制，否则永远比的是默认态。

顺带发现一个必须统一的前提：**比对页要和证据采集一样禁用动画**。
spinner 的 `transform` 会随帧变化，不禁用的话每次跑出来的值都不一样。

## 四、三件只有比对才会暴露的小事

1. **auto-space 只对部分变体生效。**
   实测宽度：primary / default / dashed 是 64px（"提 交"，插空格），
   text / link 是 60px（"文本"，不插），带 icon 不插。这条已经写进 button 协议 notes。

2. **clear 不只是改透明度。**
   antd 的 clear 在 hover 时同时改变 `background`（transparent → #fff）和
   `border-radius`（0 → 50%），常态与 hover 是两个不同的盒子。

3. **control 的 outline 常态是 3px、聚焦归零。**
   antd 的 selector 常态带着 UA 默认的 3px outline（style 为 none，不可见），
   聚焦时归零。只比对 `outline-width` 字面值会误判。

## 五、抓到一个真竞态

`select-focused` 偶发丢焦点：从 focus 事件到 React 打上 `ant-select-focused` 类之间，
只等两帧 rAF 不够。加了 80ms 的落地窗口后，连续两次抓取都稳定。

**这说明"证据可重放"本身需要验证**——一次绿不代表下次还绿。现在 `extract` 跑两遍结果一致。

## 六、剩下的缺口

| 缺口 | 归属 |
|---|---|
| 空态插图（antd 的 Empty 带 SVG 插画） | 内容资产 |
| 多选 / tags 的 tag 列表 | 协议未覆盖，需另立 |
| 浮层翻转与碰撞检测 | 行为逻辑，当前只做了下方定位 |

---

# 扩组件：Input（第六轮）

## 一、结果

| 指标 | 上轮 | 本轮 |
|---|---|---|
| 证据状态 | 42 | **58** |
| L2 用例 | 24 | **34** |
| L3 目标 | 46 | **60** |
| L3 断言 | 4048 | **5280** |

全部通过：conformance 34/34、自检 7/7、visual diff 60/60。

## 二、协议第一次遇到"结构随模式变化"

Input 有两种合法形态：

- **无前后缀**：根就是 `<input class="sm-input">`，边框和 padding 都在它身上。
- **有前后缀 / 清除**：根是 `<span class="sm-input">`，原生 input 退为 `__field`。

一开始想统一成"永远套一层包裹"，被 L3 直接否掉：参考实现的裸 input 是 `inline-block`，
包裹层最自然是 `inline-flex`，`display` 一差，后面 88 项全崩。而给纯文本输入凭空套一层，
也会污染它的语义。

所以协议承认两种形态，`protocol.schema.json` 里 `tag` 的数组写法第一次真正派上用场。
教训是：**结构自由不是目的，能让一份 CSS 同时满足两份实现才是。**

## 三、四个只有逐属性比对才会暴露的事实

1. **占位符态才有 `text-overflow: ellipsis`。**
   空值时 antd 给 ellipsis，一旦有值就回到 `clip`——对应 `:placeholder-shown`。这条纯属反直觉。

2. **affix 容器不设字体。**
   antd 只把字体挂在 input 上，包裹层继承页面默认（这里是 Times New Roman）。
   所以字体规则必须写在 `input.sm-input` 和 `__field` 上，不能写在 `.sm-input` 上。

3. **antd 的 clear 是 `<button type="button" tabindex="-1">`。**
   它的 `font-family` 因此落到 UA 默认的 Arial。我们的 clear 是 span，
   这一项按"图形部件、无文本"忽略——并在比对里显式标注，而不是悄悄放过。

4. **prefix / suffix 用 margin 而不是 gap。**
   `margin-inline: 4px` + `flex-shrink: 0`；且包裹层 hover 时 `z-index` 变 1。

## 四、当前组件矩阵

| 组件 | 证据状态 | L2 用例 | L3 目标 |
|---|---|---|---|
| Button | 26 | 12 | 20 |
| Select | 16 | 12 | 26 |
| Input | 16 | 10 | 14 |

---

# 扩组件：Checkbox（第七轮）

## 一、结果

| 指标 | 上轮 | 本轮 |
|---|---|---|
| 证据状态 | 58 | **67** |
| L2 用例 | 34 | **40** |
| L3 目标 | 60 | **70** |
| L3 断言 | 5280 | **6160** |

conformance 40/40、自检 7/7、visual diff 70/70。

## 二、`selection` 值域第一次被使用

`data-state="checked | unchecked | indeterminate"` 来自 STATE-VOCAB 第 5 节，
这是它第一次真正落地。三个状态都由同一个属性表达，样式层用
`[data-state='checked']` 切换，不需要额外的 `data-checked` 布尔。

## 三、协议被实现倒逼改了一次

最初把 `input` 和 `box` 平铺在 root 下。写样式时发现：原生 input 必须
`position: absolute` 才能盖在方框上，而绝对定位需要一个定位祖先——antd 的
`.ant-checkbox` 正是这个角色。

于是协议加了 `control` 部件（16×16、`position: relative`），input 与 box 成为它的子节点。
**结构不只是语义分组，还得承载定位上下文。** 这条以后每加一个组件都要先想一遍。

## 四、四个比对出来的细节

1. **indeterminate 时方框外观不变。**
   antd 的半选盒子仍是白底灰边，横线由 `::after` 画。只比对 DOM 会误以为它和未选一样。

2. **label 的 padding 是两侧各 8px。**
   不是只有左侧——右侧那 8px 让根宽度变成 60 而不是 52。

3. **control 有自己的 `border-radius: 4px` 和 `line-height: 14px`。**
   它不从 box 继承，必须单独写。

4. **焦点环挂在 `:focus` 而不是 `:focus-visible`。**
   程序化聚焦也会出现环。这与 Button 的 `:focus-visible` 不一致，但证据如此，照抄。

## 五、当前组件矩阵

| 组件 | 证据 | L2 | L3 |
|---|---|---|---|
| Button | 26 | 12 | 20 |
| Select | 16 | 12 | 26 |
| Input | 16 | 10 | 14 |
| Checkbox | 9 | 6 | 10 |
