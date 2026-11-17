import type { RefCase } from '../types'
import { Statistic } from '@specmark/react'

/*** Statistic */
export const statisticCases: RefCase[] = [
{
    id: 'ref-statistic-basic',
    component: 'Statistic',
    render: () => <Statistic title="标题" value={1234} />,
    assert: [
      { k: 'part', name: 'title' },
      { k: 'part', name: 'value' },
      { k: 'order', before: 'title', after: 'value' },
    ],
  },
]
