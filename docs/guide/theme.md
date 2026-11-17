# 主题与暗色

样式层只有一层变量，没有第二套规则。亮色与暗色都通过同一组 `--color-sm-*` 变量表达，
组件规则本身不感知主题。

## 切换方式

在任意祖先元素上设置 `data-theme="dark"`：

```html
<html data-theme="dark">
```

```html
<div data-theme="dark">…</div>
```

只认显式属性，**不跟随 `prefers-color-scheme`**——组件库不替宿主决定主题，避免和宿主自己的暗色逻辑打架。

## 接入 VitePress

VitePress 的暗色是给 `<html>` 加/删 `class="dark"`（不刷新页面），和我们的 `data-theme` 不是一回事。
文档站用一段 head 内联脚本把两者接起来：

```js
(function () {
  var root = document.documentElement
  function sync() {
    root.dataset.theme = root.classList.contains('dark') ? 'dark' : 'light'
  }
  sync() // 覆盖「首屏就是暗色」
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['class'] })
})()
```

## 为什么是「观察 class」而不是「监听 isDark」

用 Vue 侧 `useData().isDark` 当然也能拿到状态，但它有两个问题：

1. **时机**：`isDark` 要等客户端 hydrate 之后才可用，而此时浏览器可能已经画过一帧——
   首屏会先亮一下再变暗
2. **覆盖不全**：它只是 VitePress 的内部状态，真正生效的是 `class`。

`MutationObserver` 直接盯着那个 class，两个时机都能覆盖：脚本在 head 中同步执行一次（首屏就是暗色时不闪），
之后每次开关触发 class 变化，回调在**同一轮任务的微任务阶段**执行，仍在绘制之前。

## 为什么不改库、只改文档

库只认 `data-theme=...`，不认 `.dark`。把宿主的约定挡在文档站这一层，好处是：

- 库不绑定 VitePress；换到别的站点只需要换镜像脚本（或者直接用 `data-theme`）
- 想接入 Tailwind 的 `.dark` 约定、MUI 的 `.Mui-dark`，都只是同样的几行镜像

代价是文档站多了一段脚本，但它只有 8 行，且不进入 `packages/css`。

## 令牌来自 antd，不是手调的

亮色值等于 `theme.defaultAlgorithm(theme.defaultSeed)` 的输出，暗色值等于 `theme.darkAlgorithm(...)` 的输出。
两边逐项对账由 `scripts/check-theme-tokens.mjs` 完成：

```
令牌对账通过：29 个变量 × 亮/暗两套，与 antd theme 算法完全一致
```

种子（`components/theme/themes/seed.ts`）：

| 种子 | 值 |
|---|---|
| `colorPrimary` | `#1677ff` |
| `colorSuccess` | `#52c41a` |
| `colorWarning` | `#faad14` |
| `colorError` | `#ff4d4f` |
| `colorBgBase` | 亮 `#fff` / 暗 `#000` |
| `colorTextBase` | 亮 `#000` / 暗 `#fff` |

暗色不是把亮色反相，而是走 `dark/colors.ts` 里的两套函数：

- `getAlphaColor(colorTextBase, α)`：文字与填充按白透明度分层（`.85 / .65 / .45 / .25`）
- `getSolidColor(colorBgBase, n)`：背景与描边按黑底上叠加亮度生成
  （`colorBgContainer = n8 = #141414`，`colorBgElevated = n12 = #1f1f1f`，`colorBorder = n26 = #424242`）

## 常用变量

| 变量 | 亮 | 暗 |
|---|---|---|
| `--color-sm-text` | `rgba(0,0,0,.88)` | `rgba(255,255,255,.85)` |
| `--color-sm-text-tertiary` | `rgba(0,0,0,.45)` | `rgba(255,255,255,.45)` |
| `--color-sm-bg` | `#ffffff` | `#141414` |
| `--color-sm-bg-elevated` | `#ffffff` | `#1f1f1f` |
| `--color-sm-border` | `#d9d9d9` | `#424242` |
| `--color-sm-border-secondary` | `#f0f0f0` | `#303030` |
| `--color-sm-fill` | `rgba(0,0,0,.04)` | `rgba(255,255,255,.08)` |
| `--color-sm-primary` | `#1677ff` | `#1668dc` |
| `--color-sm-danger` | `#ff4d4f` | `#dc4446` |

完整清单见 `packages/css/src/_tokens.scss`。

## 新增样式时的规矩

1. 颜色只能引用 `--color-sm-*`，不许写字面量
2. 同一个颜色在亮暗下语义不同时，要用对应语义的变量（例如遮罩用 `--color-sm-mask`，
   而不是 `--color-sm-text-tertiary`，尽管亮色下两者都是 `rgba(0,0,0,.45)`）
3. 阴影目前仍是亮色固定值，暗色下几乎不可见，暂未令牌化

## 暗色也有 L3 证据

暗色不只是一套变量——它同样跑了与 antd 的逐属性比对：

```bash
pnpm --filter @specmark/playground-react-antd run extract:dark   # 用 darkAlgorithm 采集证据
pnpm --filter @specmark/playground-react-antd run diff:dark      # React 实现对比
pnpm --filter @specmark/playground-react-antd run diff:dark:vue  # Vue 实现对比
```

暗色证据单独落在 `artifacts-dark/`，不覆盖亮色基线；`pnpm verify` 会同时跑亮/暗共四轮比对。

这条链路抓到过一批真实问题，例如：

| 现象 | 根因 |
|---|---|
| Popover / Modal / Drawer / Dropdown 底色偏暗 | 用了 `--color-sm-bg`（container），应该用 `--color-sm-bg-elevated` |
| Switch 关闭态、Avatar 底色偏黑 | 写死 `rgba(0,0,0,.25)`，应是 `--color-sm-text-quaternary` |
| Alert info 底色偏蓝 | 用了 primary 令牌，antd 用的是 info 令牌 |
| 按钮投影在暗色下消失 | 阴影未令牌化，暗色是白色投影 |

## 仍然存在的边界

- 阴影只令牌化了按钮与聚焦环两类，其余阴影（弹层三层投影）仍是亮色固定值
- `prefers-color-scheme` 不自动生效，必须显式设置 `data-theme`
