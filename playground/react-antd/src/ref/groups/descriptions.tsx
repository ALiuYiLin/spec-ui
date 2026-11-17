import type { RefCase } from '../types'
import { Descriptions } from '@specmark/react'

/*** Descriptions */
export const descriptionsCases: RefCase[] = [
{
    id: 'ref-descriptions-basic',
    component: 'Descriptions',
    render: () => <Descriptions items={[{ label: '标签', content: '内容' }]} />,
    assert: [
      { k: 'part', name: 'item' },
      { k: 'part', name: 'label' },
      { k: 'part', name: 'content' },
      { k: 'order', before: 'label', after: 'content' },
    ],
  },
]
