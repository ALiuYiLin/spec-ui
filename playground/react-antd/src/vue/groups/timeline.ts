import type { VueCase } from '../types'
import { h } from 'vue'
import { Timeline } from '@specmark/vue'

/*** Timeline */
export const timelineRenders: Record<string, VueCase> = {
  'ref-timeline-basic': {
    component: 'Timeline',
    render: () => h(Timeline, { items: [{ content: '事件一' }, { content: '事件二' }] }),
  },
}
