import type { RefCase } from '../types'
import { Drawer } from '@specmark/react'

/*** Drawer */
export const drawerCases: RefCase[] = [
{
    id: 'ref-drawer-basic',
    component: 'Drawer',
    render: () => (
      <Drawer open title="标题">
        内容文字
      </Drawer>
    ),
    assert: [
      { k: 'data', key: 'state', value: 'open' },
      { k: 'data', key: 'side', value: 'right' },
      { k: 'part', name: 'mask' },
      { k: 'part', name: 'panel' },
      { k: 'part', name: 'header' },
      { k: 'part', name: 'body' },
      { k: 'attr', on: 'panel', key: 'role', value: 'dialog' },
      { k: 'attr', on: 'panel', key: 'aria-modal', value: 'true' },
      { k: 'order', before: 'mask', after: 'panel' },
    ],
  },
]
