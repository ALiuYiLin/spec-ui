/**
 * 部件映射的唯一真相：antd-map.json。
 *
 * 选择器 DSL（够用即可，不引入完整 CSS 引擎）：
 *   ".sm-btn"                 类名
 *   "label"                   标签
 *   ".a:not(.b)"              排除类
 *   ".a:has(.b)"              后代里含某个类
 *   ".sm-btn__icon svg"       后代标签
 *   "@fn:antdBtnLabel"        特殊函数（由调用方提供）
 *   "@portal:0"               portal 列表的第 0 个
 */
import fs from 'node:fs'
import path from 'node:path'

const MAP_PATH = path.resolve(import.meta.dirname, '..', '..', '..', 'antd-map.json')
export const ANTD_MAP = JSON.parse(fs.readFileSync(MAP_PATH, 'utf8'))

const hasDescendantClass = (node, cls) =>
  (node.children ?? []).some((c) => (c.classes ?? []).includes(cls) || hasDescendantClass(c, cls))

const findDescendantTag = (node, tag) => {
  for (const child of node?.children ?? []) {
    if (child.tag === tag) return child
    const found = findDescendantTag(child, tag)
    if (found) return found
  }
  return null
}

/** 用选择器在一个节点列表里找第一个匹配项 */
export function select(nodes, selector) {
  for (const node of nodes) {
    const parts = selector.split(' ').filter(Boolean)
    let cur = node
    let ok = true
    for (let i = 0; i < parts.length; i += 1) {
      const part = parts[i]
      if (i > 0) {
        cur = findDescendantTag(cur, part)
        if (!cur) {
          ok = false
          break
        }
        continue
      }
      if (!matchSimple(cur, part)) {
        ok = false
        break
      }
    }
    if (ok) return cur
  }
  return null
}

function matchSimple(node, part) {
  if (!node) return false
  if (part.startsWith('.')) {
    let cls = part.slice(1)
    let not = null
    let has = null
    const notMatch = cls.match(/:not\(\.([^)]+)\)/)
    if (notMatch) {
      not = notMatch[1]
      cls = cls.replace(notMatch[0], '')
    }
    const hasMatch = cls.match(/:has\(\.([^)]+)\)/)
    if (hasMatch) {
      has = hasMatch[1]
      cls = cls.replace(hasMatch[0], '')
    }
    const classes = node.classes ?? []
    if (!classes.includes(cls)) return false
    if (not && classes.includes(not)) return false
    if (has && !hasDescendantClass(node, has)) return false
    return true
  }
  return node.tag === part
}

/** 把 map 编译成 visual-diff 用的 RESOLVE 结构 */
export function buildResolve(map, helpers) {
  const out = {}
  for (const [component, parts] of Object.entries(map)) {
    out[component] = {}
    for (const [part, entry] of Object.entries(parts)) {
      const make = (selector, side) => {
        if (selector.startsWith('@fn:')) {
          const name = selector.slice('@fn:'.length)
          const fn = helpers[name]
          if (!fn) throw new Error(`antd-map: 缺少特殊函数 ${name}`)
          return fn
        }
        if (selector.startsWith('@any:')) {
          const options = selector.slice('@any:'.length).split(',')
          return (all) => {
            for (const option of options) {
              const found = select(all, option)
              if (found) return found
            }
            return null
          }
        }
        if (selector.startsWith('@portal:')) {
          const index = Number(selector.slice('@portal:'.length))
          return (all, portals) => portals?.[index]
        }
        return (all) => select(all, selector)
      }
      out[component][part] = { ref: make(entry.ref, 'ref'), antd: make(entry.antd, 'antd') }
    }
  }
  return out
}
