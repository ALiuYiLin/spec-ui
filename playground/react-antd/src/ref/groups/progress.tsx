import type { RefCase } from '../types'
import { Progress } from '@specmark/react'

/*** Progress */
export const progressCases: RefCase[] = [
{
    id: 'ref-progress-basic',
    component: 'Progress',
    render: () => <Progress percent={40} />,
    assert: [
      { k: 'attr', on: 'root', key: 'role', value: 'progressbar' },
      { k: 'part', name: 'rail' },
      { k: 'part', name: 'bar' },
      { k: 'order', before: 'rail', after: 'bar' },
      { k: 'data', key: 'status', value: 'normal' },
    ],
  },
]
