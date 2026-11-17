import type { RefCase } from '../types'
import { Tag } from '@specmark/react'

/*** Tag */
export const tagCases: RefCase[] = [
{
    id: 'ref-tag-basic',
    component: 'Tag',
    render: () => <Tag>标签</Tag>,
    assert: [{ k: 'data', key: 'tone', value: 'default' }, { k: 'absent', name: 'close' }],
  },
  {
    id: 'ref-tag-closable',
    component: 'Tag',
    render: () => <Tag closable>标签</Tag>,
    assert: [
      { k: 'part', name: 'close' },
      { k: 'attr', on: 'close', key: 'type', value: 'button' },
    ],
  },
]
