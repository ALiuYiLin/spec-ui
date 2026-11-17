import { createApp, h } from 'vue'
import '@specmark/css/index.css'
import '../ref/harness.css'
import { renders } from './cases'

const params = new URLSearchParams(window.location.search)
const requested = params.get('case')
const activeId = requested && renders[requested] ? requested : Object.keys(renders)[0]
const active = renders[activeId]

// 与 React 台同一份契约：id / component / actions / pseudo / assert
;(window as unknown as Record<string, unknown>).__CONFORMANCE__ = Object.entries(renders).map(([id, c]) => ({
  id,
  component: c.component,
  actions: c.actions ?? [],
  pseudo: [],
  assert: [],
}))
;(window as unknown as Record<string, unknown>).__SPECMARK_ACTIVE__ = activeId

const App = {
  render() {
    return h('div', { style: { padding: '32px' } }, [h('div', { 'data-case-root': '' }, [active.render()])])
  },
}

createApp(App).mount('#app')
