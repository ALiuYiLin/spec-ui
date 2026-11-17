/**
 * 主题令牌对账：把 packages/css 里的亮/暗两套变量，逐项与 antd 的
 * defaultAlgorithm / darkAlgorithm 输出比较。
 *
 * 存在意义：暗色值不是手调的，必须与 antd 的算法结果完全一致；
 * 一旦有人改了令牌，这里会立刻报错。
 */
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { theme } = require('antd')

// 脚本的 cwd 是 playground/react-antd，令牌文件要按仓库根定位
const TOKENS = path.resolve(import.meta.dirname, '../../../packages/css/src/_tokens.scss')
const source = fs.readFileSync(TOKENS, 'utf8')

const light = theme.defaultAlgorithm(theme.defaultSeed)
const dark = theme.darkAlgorithm(theme.defaultSeed)

/** 变量 → [antd 亮色 token, antd 暗色 token] */
const PAIRS = {
  '--color-sm-primary': ['colorPrimary', 'colorPrimary'],
  '--color-sm-primary-hover': ['colorPrimaryHover', 'colorPrimaryHover'],
  '--color-sm-primary-active': ['colorPrimaryActive', 'colorPrimaryActive'],
  '--color-sm-primary-bg': ['colorPrimaryBg', 'colorPrimaryBg'],
  '--color-sm-ring': ['colorPrimaryBorder', 'colorPrimaryBorder'],
  '--color-sm-success': ['colorSuccess', 'colorSuccess'],
  '--color-sm-success-bg': ['colorSuccessBg', 'colorSuccessBg'],
  '--color-sm-success-border': ['colorSuccessBorder', 'colorSuccessBorder'],
  '--color-sm-warning': ['colorWarning', 'colorWarning'],
  '--color-sm-warning-bg': ['colorWarningBg', 'colorWarningBg'],
  '--color-sm-warning-border': ['colorWarningBorder', 'colorWarningBorder'],
  '--color-sm-danger': ['colorError', 'colorError'],
  '--color-sm-danger-bg': ['colorErrorBg', 'colorErrorBg'],
  '--color-sm-danger-border': ['colorErrorBorder', 'colorErrorBorder'],
  // --color-sm-text-base 故意不进对账：它是 antd 容器元素在两种主题下都继承到的 #000，
  // 不是 antd 的 colorTextBase（后者暗色为 #fff）。证据见 Empty / Result / Image 的 root color。
  '--color-sm-text': ['colorText', 'colorText'],
  '--color-sm-text-secondary': ['colorTextSecondary', 'colorTextSecondary'],
  '--color-sm-text-tertiary': ['colorTextTertiary', 'colorTextTertiary'],
  '--color-sm-text-quaternary': ['colorTextQuaternary', 'colorTextQuaternary'],
  '--color-sm-bg': ['colorBgContainer', 'colorBgContainer'],
  '--color-sm-bg-elevated': ['colorBgElevated', 'colorBgElevated'],
  '--color-sm-bg-layout': ['colorBgLayout', 'colorBgLayout'],
  '--color-sm-bg-spotlight': ['colorBgSpotlight', 'colorBgSpotlight'],
  '--color-sm-mask': ['colorBgMask', 'colorBgMask'],
  '--color-sm-fill': ['colorFillTertiary', 'colorFillTertiary'],
  '--color-sm-fill-secondary': ['colorFillSecondary', 'colorFillSecondary'],
  '--color-sm-fill-quaternary': ['colorFillQuaternary', 'colorFillQuaternary'],
  '--color-sm-border': ['colorBorder', 'colorBorder'],
  '--color-sm-border-secondary': ['colorBorderSecondary', 'colorBorderSecondary'],
}

/** 取某个选择器块里的变量表 */
const block = (selector) => {
  const start = source.indexOf(selector)
  if (start < 0) throw new Error(`找不到 ${selector}`)
  const open = source.indexOf('{', start)
  const close = source.indexOf('}', open)
  const body = source.slice(open + 1, close)
  const vars = {}
  for (const m of body.matchAll(/--[\w-]+:\s*([^;]+);/g)) {
    vars[m[0].split(':')[0].trim()] = m[1].trim()
  }
  return vars
}

const lightVars = block(':root')
const darkVars = block("[data-theme='dark']")

/** 颜色归一化：#fff / #ffffff / rgba 空格差异都算相同 */
const norm = (value) => {
  const v = String(value).trim().toLowerCase().replace(/\s+/g, '')
  if (/^#[0-9a-f]{3}$/.test(v)) {
    return `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`
  }
  if (/^#[0-9a-f]{6}$/.test(v)) return v
  const m = v.match(/^rgba?\((\d+),(\d+),(\d+)(?:,([\d.]+))?\)$/)
  if (m) {
    const a = m[4] === undefined ? '1' : String(Number(m[4]))
    return `rgba(${m[1]},${m[2]},${m[3]},${a})`
  }
  return v
}

const failures = []
let checked = 0

for (const [cssVar, [lightKey, darkKey]] of Object.entries(PAIRS)) {
  const expectLight = norm(light[lightKey])
  const expectDark = norm(dark[darkKey])

  const actualLight = lightVars[cssVar]
  const actualDark = darkVars[cssVar]

  if (!actualLight) failures.push(`${cssVar}: 亮色变量缺失`)
  else if (norm(actualLight) !== expectLight) {
    failures.push(`${cssVar}: 亮色 ${actualLight} ≠ antd ${lightKey} ${light[lightKey]}`)
  }

  if (!actualDark) failures.push(`${cssVar}: 暗色变量缺失`)
  else if (norm(actualDark) !== expectDark) {
    failures.push(`${cssVar}: 暗色 ${actualDark} ≠ antd ${darkKey} ${dark[darkKey]}`)
  }

  checked += 1
}

if (failures.length) {
  console.error(`令牌对账失败 ${failures.length} 项：`)
  for (const f of failures) console.error(`  · ${f}`)
  process.exit(1)
}

console.log(`令牌对账通过：${checked} 个变量 × 亮/暗两套，与 antd theme 算法完全一致`)
