import type { RefCase } from '../types'
import { Skeleton } from '@specmark/react'

/*** Skeleton */
export const skeletonCases: RefCase[] = [
{
    id: 'ref-skeleton-basic',
    component: 'Skeleton',
    render: () => (
      <div style={{ width: 256 }}>
        <Skeleton />
      </div>
    ),
    assert: [
      { k: 'attr', on: 'root', key: 'aria-busy', value: 'true' },
      { k: 'part', name: 'title' },
      { k: 'part', name: 'paragraph' },
      { k: 'part', name: 'item' },
      { k: 'order', before: 'title', after: 'paragraph' },
    ],
  },
]
