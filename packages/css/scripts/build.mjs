import fs from 'node:fs'
import * as sass from 'sass'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'

const ENTRY = 'src/index.scss'
const OUT_DIR = 'dist'
const OUT_FILE = `${OUT_DIR}/index.css`

const started = Date.now()

// 1) Sass：把 32 个 partial 合成一份 CSS
const compiled = sass.compile(ENTRY, {
  style: 'compressed',
  loadPaths: ['src'],
  sourceMap: false,
})

// 2) PostCSS：只做浏览器前缀与最终整理
const processed = await postcss([autoprefixer]).process(compiled.css, { from: undefined })

fs.mkdirSync(OUT_DIR, { recursive: true })
fs.writeFileSync(OUT_FILE, `${processed.css}\n`, 'utf8')

const bytes = fs.statSync(OUT_FILE).size
const ms = Date.now() - started
console.log(`✓ ${OUT_FILE}  ${(bytes / 1024).toFixed(1)} kB  ${ms} ms`)
