import fsp from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ARTIFACTS = path.resolve(__dirname, '..', '..', '..', 'artifacts')

const readJson = async (f) => JSON.parse(await fsp.readFile(f, 'utf8'))
const flat = (n, out = []) => {
  out.push(n)
  for (const k of n.children ?? []) flat(k, out)
  return out
}

const entries = (await fsp.readdir(ARTIFACTS, { withFileTypes: true })).filter((d) => d.isDirectory())

for (const e of entries) {
  const dir = path.join(ARTIFACTS, e.name)
  let manifest
  try {
    manifest = await readJson(path.join(dir, 'manifest.json'))
  } catch {
    continue
  }

  console.log('')
  console.log('='.repeat(100))
  console.log(`${manifest.component}  ·  antd ${manifest.source.version}  ·  ${manifest.source.browser}`)
  console.log(`viewport ${manifest.source.viewport.width}x${manifest.source.viewport.height} @${manifest.source.dpr}x`)
  console.log('='.repeat(100))

  const records = new Map()
  for (const c of manifest.cases) records.set(c.id, await readJson(path.join(dir, c.json)))

  console.log('')
  console.log('── 根节点 ──')
  for (const c of manifest.cases) {
    const r = records.get(c.id)
    const s = r.tree.style
    const box = r.tree.rect
    const ring = s['outline-style'] === 'none' ? '-' : `${s['outline-width']} ${s['outline-color']}`
    console.log(
      [
        c.id.padEnd(30),
        (c.pseudoForced.length ? `[${c.pseudoForced.join('+')}]` : '').padEnd(14),
        `bg=${s['background-color']}`.padEnd(26),
        `fg=${s['color']}`.padEnd(22),
        `bd=${s['border-top-color']}`.padEnd(22),
        `r=${s['border-top-left-radius']}`.padEnd(10),
        `${Math.round(box.w)}x${Math.round(box.h)}`.padEnd(9),
        `ring=${ring}`,
      ].join(' '),
    )
  }

  if (manifest.component === 'Select') {
    console.log('')
    console.log('── 结构与状态 ──')
    for (const c of manifest.cases) {
      const r = records.get(c.id)
      const all = [...flat(r.tree)]
      for (const p of r.portals) all.push(...flat(p))
      const input = all.find((n) => n.tag === 'input')
      const control = all.find((n) => n.classes.some((x) => x.includes('selector')))
      const selected = all.filter((n) => n.classes.includes('ant-select-item-option') && n.attrs['aria-selected'] === 'true')
      console.log(
        [
          c.id.padEnd(30),
          `control${control ? '(' + Math.round(control.rect.h) + ')' : ''}`.padEnd(12),
          `aria-expanded=${(input && input.attrs['aria-expanded']) ?? '-'}`.padEnd(20),
          `activedesc=${((input && input.attrs['aria-activedescendant']) || '-').slice(-6)}`.padEnd(14),
          `disabled=${(input && input.attrs.disabled) ?? '-'}`.padEnd(14),
          `selected=${selected.length}`.padEnd(12),
          `portals=${r.portals.length}`,
        ].join(' '),
      )
    }

    for (const c of manifest.cases.filter((x) => records.get(x.id).portals.length)) {
      const r = records.get(c.id)
      const p = r.portals[0]
      const nodes = flat(p)
      const opts = nodes.filter((n) => n.classes.includes('ant-select-item-option'))
      console.log('')
      console.log(`# ${c.id}   portal ${Math.round(p.rect.w)}x${Math.round(p.rect.h)}  pos=${p.style.position}  z=${
        p.style['z-index']
      }`)
      console.log(
        `  portal class: ${p.classes.filter((x) => x.startsWith('ant-')).join(' ')}`,
      )
      for (const o of opts) {
        const s = o.style
        console.log(
          [
            '  option',
            (flat(o).map((n) => n.ownText).filter(Boolean).join('') || '-').padEnd(10),
            `sel=${(o.attrs['aria-selected'] ?? '-').padEnd(6)}`,
            `dis=${(o.attrs['aria-disabled'] ?? '-').padEnd(6)}`,
            `cls=${o.classes.filter((x) => x.includes('active') || x.includes('selected')).join(',') || '-'}`.padEnd(
              26,
            ),
            `bg=${s['background-color']}`.padEnd(24),
            `fg=${s['color']}`,
          ].join(' '),
        )
      }
      if (!opts.length) console.log('  (no option)')
    }
  }

  if (manifest.component === 'Button') {
    console.log('')
    console.log('── 强制伪类是否真的改变了样式 ──')
    const pairs = [
      ['button-primary-md', 'button-primary-md-hover'],
      ['button-primary-md', 'button-primary-md-active'],
      ['button-primary-md', 'button-primary-md-focus'],
      ['button-primary-md', 'button-primary-md-focus-visible'],
      ['button-default-md', 'button-default-md-hover'],
      ['button-default-md', 'button-default-md-active'],
      ['button-default-md', 'button-default-md-focus-visible'],
      ['button-text-md', 'button-text-md-hover'],
      ['button-link-md', 'button-link-md-hover'],
      ['button-disabled', 'button-disabled-hover'],
    ]
    const KEYS = ['background-color', 'color', 'border-top-color', 'box-shadow', 'outline-style', 'outline-color']
    let changed = 0
    for (const [a, b] of pairs) {
      if (!records.has(a) || !records.has(b)) continue
      const A = records.get(a).tree.style
      const B = records.get(b).tree.style
      const diffs = KEYS.filter((k) => A[k] !== B[k])
      if (diffs.length) changed += 1
      console.log(`${b.padEnd(34)} ${diffs.length ? 'CHANGED' : 'no-change'}  ${diffs.map((k) => `${k}: ${A[k]} -> ${B[k]}`).join(' | ')}`)
    }
    console.log(`changed ${changed}/${pairs.length}`)
  }

  if (manifest.failures?.length) {
    console.log('')
    console.log(`!! failures: ${manifest.failures.map((f) => f.id + ': ' + f.error).join('; ')}`)
  }
}
