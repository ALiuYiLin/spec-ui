import type { RefCase } from '../types'
import { Empty } from '@specmark/react'

/*** Empty */
export const emptyCases: RefCase[] = [
{
    id: 'ref-empty-basic',
    component: 'Empty',
    render: () => <Empty />,
    assert: [
      { k: 'part', name: 'image' },
      { k: 'part', name: 'description' },
      { k: 'order', before: 'image', after: 'description' },
    ],
  },
]
