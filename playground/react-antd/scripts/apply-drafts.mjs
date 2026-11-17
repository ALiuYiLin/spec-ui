/**
 * 把推断器产出的草稿合并进 spec，并用 L2 逐个验证。
 * - 已经有手写 requires 的组件跳过（Input / Select / Modal）
 * - 合并后立即跑该组件的 conformance；不通过就回滚并记录原因
 *
 * 用法：node apply-drafts.mjs [--dry]
 */
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..', '..', '..')
const SPEC_DIR = path.join(ROOT, 'spec', 'components')
const DRAFT_DIR = path.join(ROOT, 'spec', 'drafts')
const PLAYGROUND = path.join(ROOT, 'playground', 'react-antd')
const dry = process.argv.includes('--dry')

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

const runConformance = (component) => {
  try {
    execSync(`node scripts/conformance.mjs --component=${component}`, {
      cwd: PLAYGROUND,
      stdio: 'pipe',
    })
    return { ok: true }
  } catch (e) {
    const out = `${e.stdout ?? ''}${e.stderr ?? ''}`
    const failLine = out
      .split(/\r?\n/)
      .filter((l) => l.includes('·') || l.includes('failed:'))
      .slice(0, 2)
      .join(' / ')
    return { ok: false, detail: failLine || '未知错误' }
  }
}

const rows = []
for (const file of fs.readdirSync(DRAFT_DIR).filter((f) => f.endsWith('.json'))) {
  const draft = JSON.parse(fs.readFileSync(path.join(DRAFT_DIR, file), 'utf8'))
  const component = draft.component
  const specPath = path.join(SPEC_DIR, `${kebab(component)}.spec.json`)
  if (!fs.existsSync(specPath)) {
    rows.push({ component, status: '缺 spec' })
    continue
  }

  const original = fs.readFileSync(specPath, 'utf8')
  const spec = JSON.parse(original)

  const alreadyHand = Object.values(spec.anatomy.parts ?? {}).some((p) => p.requires || p.attach)
  if (alreadyHand) {
    rows.push({ component, status: '已手写，跳过' })
    continue
  }
  if (!Object.keys(draft.draft ?? {}).length) {
    rows.push({ component, status: '草稿为空' })
    continue
  }

  let merged = 0
  for (const [name, entry] of Object.entries(draft.draft)) {
    const part = spec.anatomy.parts?.[name]
    if (!part) continue
    if (entry.attach) {
      part.attach = entry.attach
      merged += 1
      continue
    }
    if (entry.requires) {
      part.requires = entry.requires
      merged += 1
    }
    if (entry.many) part.many = true
  }

  if (dry) {
    rows.push({ component, status: `dry：将合并 ${merged} 个部件` })
    continue
  }

  fs.writeFileSync(specPath, `${JSON.stringify(spec, null, 2)}\n`, 'utf8')
  const result = runConformance(component)
  if (result.ok) {
    rows.push({ component, status: `合并 ${merged} 个部件，L2 通过` })
  } else {
    fs.writeFileSync(specPath, original, 'utf8')
    rows.push({ component, status: `回滚（${result.detail}）` })
  }
}

const width = Math.max(...rows.map((r) => r.component.length))
for (const r of rows) console.log(`${r.component.padEnd(width)}  ${r.status}`)
const merged = rows.filter((r) => r.status.includes('L2 通过')).length
console.log(`\n合并成功 ${merged} / ${rows.length}`)
