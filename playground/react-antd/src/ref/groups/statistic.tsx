import type { RefCase } from '../types'
import { Statistic } from '@specmark/react'

/*** Statistic */
export const statisticCases: RefCase[] = [
{
    id: 'ref-statistic-basic',
    component: 'Statistic',
    render: () => (
      <div style={{ width: 256 }}>
        <Statistic title="标题" value={1234} />
      </div>
    ),
    assert: [
      { k: 'part', name: 'title' },
      { k: 'part', name: 'value' },
      { k: 'order', before: 'title', after: 'value' },
    ],
  },
  {
    id: 'ref-statistic-precision',
    component: 'Statistic',
    render: () => (
      <div style={{ width: 256 }}>
        <Statistic title="金额" value={1234.5} precision={2} />
      </div>
    ),
    assert: [],
  },
]
