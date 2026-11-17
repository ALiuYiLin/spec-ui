# playground/react-antd

采集台 + 校验台。三个页面：

| 页面 | 用途 |
|---|---|
| `index.html` | **antd 证据台**：按受控状态矩阵渲染 antd 组件，抓成快照 |
| `ref.html` | **React 实现台**：渲染 `packages/react`，供 L2 / L3 校验 |
| `vue.html` | **Vue 实现台**：渲染 `packages/vue`，跑同一套 L2 / L3 |

## 命令

在仓库根目录：

```bash
pnpm typecheck    # 全仓类型检查（tsc -p tsconfig.json --noEmit）
pnpm verify       # typecheck + L2 + 自检 + L3，一条命令跑完全部
```

在本目录：

```bash
pnpm build        # 构建两个页面
pnpm extract      # 抓取 antd 证据 → artifacts/<component>/*.json + *.png
pnpm summarize    # 终端表格：各状态根节点样式、强制伪类是否生效
pnpm report       # 生成 artifacts/index.html 可视化核对页

pnpm conformance  # L2：React 实现 vs 协议（DOM 契约）
pnpm selftest     # L2 自检：确认校验器会拒绝错误实现
pnpm diff         # L3：React 实现的计算样式 vs antd 证据
pnpm conformance:vue  # L2：Vue 实现跑同一份用例
pnpm diff:vue         # L3：Vue 实现跑同一份目标
pnpm conformance -- --component=Button   # 只跑某个组件的 L2
pnpm diff -- --component=Button          # 只比某个组件的 L3
pnpm verify       # 以上全部（两套实现都跑）
```

## 结构

```
src/matrix/             antd 证据台的状态矩阵（button / select）
src/ref/cases.tsx       参考实现的用例与断言（校验器从页面读取）
（样式层已移到 packages/css，构建产物为 packages/css/dist/index.css）
src/ref/harness.css     仅比对台用的布局约束（Select 200px 宽）
scripts/props.mjs       采集与比对共用的属性白名单（唯一来源）
scripts/extract.mjs     静态服务 + Playwright 抓取
scripts/conformance.mjs 通用规则 + 声明式断言 + 自检
scripts/visual-diff.mjs 计算样式逐属性比对
scripts/summarize.mjs   终端核对
scripts/report.mjs      HTML 核对页
```

## 为什么这么做

- **受控 props 而不是点击**：`loading`/`open` 等直接由 props 渲染，避免赌动画和时序。
- **伪类用 CDP 强制**：`CSS.forcePseudoState` 是拿到 `:hover` / `:active` / `:focus-visible`
  真实层叠结果的唯一办法；改 class 模拟得到的是假数据。
- **同时存 computed style**：hover 这类状态的 DOM 和类名与默认态完全相同，只存结构会把它丢掉。
- **一致性用断言而不是肉眼**：用例自带期望，校验器只认 DOM 与协议，不认框架。
- **属性白名单只有一个来源**：`props.mjs`。采集没存的属性，比对时会变成 undefined，
  "看起来一致"其实是"根本没比"。

## 当前覆盖

| 项 | 数量 |
|---|---|
| 证据状态（antd） | 67 |
| L2 用例（DOM 契约） | 40 |
| L2 自检夹具 | 7 |
| L3 目标（部件 × 状态） | 70 |
| L3 断言（每目标 88 项属性） | 6160 |

交互态（hover / active / focus-visible / focus-within）通过 CDP `CSS.forcePseudoState` 覆盖；
图标（spinner / arrow / clear）的路径由 `artifacts/` 里的 svg 节点生成，不手写。

## 注意

- antd 版本在 `package.json` 里精确锁定；升级版本等于基线漂移，需重跑 `extract` 并重新 `diff`。
- 元素上的 `css-xxxxxx` 类名是 cssinjs 的构建哈希，**不可作为协议依据**。
- 样式层**不引入 Tailwind preflight**：preflight 会给所有元素加 `border-box` + `solid`，
  与 antd 的 reset（只有根节点 border-box、子部件 content-box）天然冲突。
- `@specmark/react` 通过 `vite.config.ts` 的 alias 指向 `packages/react/src`。
- `artifacts/` 与 `dist/` 已在 `.gitignore` 里，随时可用 `pnpm extract` / `pnpm build` 重建。
- 证据必须可重放：`extract` 连续跑两次结果要一致；再改抓取逻辑后记得跑两遍验证。
