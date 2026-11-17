import type { RefCase } from '../types'
import { Card } from '@specmark/react'

/*** Card */
export const cardCases: RefCase[] = [
{
    id: 'ref-card-basic',
    component: 'Card',
    render: () => (
      <Card title="标题" extra={<span>更多</span>}>
        内容
      </Card>
    ),
    assert: [
      { k: 'part', name: 'header' },
      { k: 'part', name: 'title' },
      { k: 'part', name: 'body' },
      { k: 'order', before: 'header', after: 'body' },
      { k: 'childOf', on: 'title', of: 'header' },
    ],
  },
]
