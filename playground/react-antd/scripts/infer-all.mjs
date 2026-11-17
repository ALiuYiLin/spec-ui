import { execSync } from 'node:child_process'
import fs from 'node:fs'

const specDir = 'spec/components'
const components = fs
  .readdirSync(specDir)
  .filter((f) => f.endsWith('.spec.json'))
  .map((f) => JSON.parse(fs.readFileSync(`${specDir}/${f}`, 'utf8')).component)

const rows = []
for (const component of components) {
  let out = ''
  try {
    out = execSync(`node scripts/infer-relations.mjs --component=${component} --write`, {
      cwd: 'playground/react-antd',
      stdio: 'pipe',
    }).toString()
  } catch (e) {
    out = 'ERROR'
  }
  let report = null
  try {
    report = JSON.parse(fs.readFileSync(`spec/drafts/${component.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}.json`, 'utf8'))
  } catch {
    /* ignore */
  }
  rows.push({
    component,
    inferred: report?.inferred ?? 0,
    issues: report?.issues?.length ?? 0,
    diff: report?.diff?.length ?? 0,
  })
}

rows.sort((a, b) => b.inferred - a.inferred)
for (const r of rows) {
  console.log(`${r.component.padEnd(14)} inferred=${String(r.inferred).padStart(2)}  issues=${String(r.issues).padStart(2)}  diff=${String(r.diff).padStart(2)}`)
}
const total = rows.reduce((n, r) => n + r.inferred, 0)
console.log(`\n合计推断出 ${total} 个部件的关系`)
