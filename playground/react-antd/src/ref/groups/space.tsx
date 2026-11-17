import type { RefCase } from '../types'
import { Space } from '@specmark/react'

/*** Space */
export const spaceCases: RefCase[] = [
{
    id: 'ref-space-basic',
    component: 'Space',
    render: () => (
      <Space>
        <span>一</span>
        <span>二</span>
      </Space>
    ),
    assert: [
      { k: 'data', key: 'direction', value: 'horizontal' },
      { k: 'data', key: 'size', value: 'md' },
      { k: 'part', name: 'item' },
    ],
  },
]
