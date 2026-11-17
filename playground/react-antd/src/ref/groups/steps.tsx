import type { RefCase } from '../types'
import { Steps } from '@specmark/react'

/*** Steps */
export const stepsCases: RefCase[] = [
{
    id: 'ref-steps-basic',
    component: 'Steps',
    render: () => <Steps current={1} items={[{ title: '第一步' }, { title: '第二步' }]} />,
    assert: [
      { k: 'data', key: 'direction', value: 'horizontal' },
      { k: 'part', name: 'item' },
      { k: 'part', name: 'title' },
    ],
  },
]
