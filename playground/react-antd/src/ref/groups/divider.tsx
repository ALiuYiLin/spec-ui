import type { RefCase } from '../types'
import { Divider } from '@specmark/react'

/*** Divider */
export const dividerCases: RefCase[] = [
{
    id: 'ref-divider-basic',
    component: 'Divider',
    render: () => <Divider />,
    assert: [
      { k: 'data', key: 'orientation', value: 'horizontal' },
      { k: 'data', key: 'variant', value: 'solid' },
      { k: 'absent', name: 'text' },
    ],
  },
  {
    id: 'ref-divider-text',
    component: 'Divider',
    render: () => <Divider>文本</Divider>,
    assert: [{ k: 'part', name: 'text' }],
  },
]
