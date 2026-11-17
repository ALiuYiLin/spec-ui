import type { RefCase } from '../types'
import { Spin } from '@specmark/react'

/*** Spin */
export const spinCases: RefCase[] = [
{
    id: 'ref-spin-basic',
    component: 'Spin',
    render: () => <Spin />,
    assert: [
      { k: 'data', key: 'size', value: 'md' },
      { k: 'attr', on: 'root', key: 'role', value: 'status' },
      { k: 'part', name: 'dot' },
      { k: 'absent', name: 'tip' },
    ],
  },
  {
    id: 'ref-spin-sm',
    component: 'Spin',
    render: () => (<Spin size="sm" />),
    assert: [],
  },
  {
    id: 'ref-spin-lg',
    component: 'Spin',
    render: () => (<Spin size="lg" />),
    assert: [],
  },
]
