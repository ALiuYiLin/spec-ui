import type { RefCase } from '../types'
import { Breadcrumb } from '@specmark/react'

/*** Breadcrumb */
export const breadcrumbCases: RefCase[] = [
{
    id: 'ref-breadcrumb-basic',
    component: 'Breadcrumb',
    render: () => <Breadcrumb items={[{ title: '首页' }, { title: '列表' }]} />,
    assert: [
      { k: 'part', name: 'item' },
      { k: 'part', name: 'separator' },
      { k: 'attr', on: 'root', key: 'aria-label' },
      { k: 'attr', on: 'separator', key: 'aria-hidden', value: 'true' },
    ],
  },
]
