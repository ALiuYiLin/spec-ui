import type { RefCase } from '../types'
import { Timeline } from '@specmark/react'

/*** Timeline */
export const timelineCases: RefCase[] = [
{
    id: 'ref-timeline-basic',
    component: 'Timeline',
    render: () => <Timeline items={[{ content: '事件一' }, { content: '事件二' }]} />,
    assert: [
      { k: 'part', name: 'item' },
      { k: 'part', name: 'dot' },
      { k: 'part', name: 'content' },
      { k: 'attr', on: 'item', key: 'data-tone', value: 'default' },
    ],
  },
]
