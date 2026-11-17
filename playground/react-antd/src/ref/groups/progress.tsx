import type { RefCase } from '../types'
import { Progress } from '@specmark/react'

/*** Progress */
export const progressCases: RefCase[] = [
{
    id: 'ref-progress-basic',
    component: 'Progress',
    render: () => (
      <div style={{ width: 256 }}>
        <Progress percent={40} />
      </div>
    ),
    assert: [
      { k: 'attr', on: 'root', key: 'role', value: 'progressbar' },
      { k: 'part', name: 'rail' },
      { k: 'part', name: 'bar' },
      { k: 'order', before: 'rail', after: 'bar' },
      { k: 'data', key: 'status', value: 'normal' },
    ],
  },
  {
    id: 'ref-progress-success',
    component: 'Progress',
    render: () => (
      <div style={{ width: 256 }}>
        <Progress percent={100} status="success" />
      </div>
    ),
    assert: [],
  },
  {
    id: 'ref-progress-exception',
    component: 'Progress',
    render: () => (
      <div style={{ width: 256 }}>
        <Progress percent={70} status="exception" />
      </div>
    ),
    assert: [],
  },
]
