import type { RefCase } from '../types'
import { Result } from '@specmark/react'

/*** Result */
export const resultCases: RefCase[] = [
{
    id: 'ref-result-info',
    component: 'Result',
    render: () => <Result status="info" title="标题" />,
    assert: [
      { k: 'data', key: 'status', value: 'info' },
      { k: 'part', name: 'icon' },
      { k: 'part', name: 'title' },
      { k: 'absent', name: 'subtitle' },
      { k: 'order', before: 'icon', after: 'title' },
    ],
  },
]
