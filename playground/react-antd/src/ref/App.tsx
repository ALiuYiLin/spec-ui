import { cases } from './cases'

const params = new URLSearchParams(window.location.search)
const active = cases.find((c) => c.id === params.get('case')) ?? cases[0]

// 暴露给校验器：用例与断言只有一份定义
;(window as any).__CONFORMANCE__ = cases.map(({ id, component, actions, pseudo, assert }) => ({
  id,
  component,
  actions: actions ?? [],
  pseudo: pseudo ?? [],
  assert,
}))
;(window as any).__ACTVIEW_ACTIVE__ = active.id

export default function App() {
  return (
    <div style={{ padding: 32 }}>
      <div data-case-root="">{active.render()}</div>
    </div>
  )
}
