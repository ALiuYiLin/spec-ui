import type { RefCase } from '../types'
import { Badge } from '@specmark/react'

/*** Badge */
export const badgeCases: RefCase[] = [
{
    id: 'ref-badge-basic',
    component: 'Badge',
    render: () => (
      <Badge count={5}>
        <span style={{ display: 'inline-block', width: 40, height: 40 }} />
      </Badge>
    ),
    assert: [{ k: 'part', name: 'count' }],
  },
]
