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

## 已知边界

暗色**尚未接入 L3 视觉比对**。当前证据链是：

- 亮色：L3 与 antd 逐属性比对（168 个目标全绿）
- 暗色：令牌值与 antd 的 `darkAlgorithm` 逐项对账

也就是说暗色证明了「变量值完全一致」，但没有证明「每个组件的暗色渲染与 antd 一致」。
要做到后者，需要给 antd 证据台加一套暗色算法配置并重新采集证据。
