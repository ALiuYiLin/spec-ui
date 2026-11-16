import { cases } from './matrix'

const params = new URLSearchParams(window.location.search)
const requested = params.get('case')
const active = cases.find((c) => c.id === requested) ?? cases[0]

// 暴露给抓取脚本，保证"矩阵"只有一份定义
;(window as any).__SPECMARK_CASES__ = cases.map(({ id, component, state, pseudo, actions, portal }) => ({
  id,
  component,
  state,
  pseudo: pseudo ?? [],
  actions: actions ?? [],
  portal: Boolean(portal),
}))
;(window as any).__SPECMARK_ACTIVE__ = active.id

export default function App() {
  return (
    <div style={{ width: 320, padding: 32, boxSizing: 'border-box', background: '#fff' }}>
      <div data-case-root="">{active.render()}</div>
    </div>
  )
}
