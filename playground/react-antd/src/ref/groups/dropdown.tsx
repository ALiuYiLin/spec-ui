import type { RefCase } from '../types'
import { Dropdown } from '@specmark/react'

/*** Dropdown */
export const dropdownCases: RefCase[] = [
{
    id: 'ref-dropdown-basic',
    component: 'Dropdown',
    render: () => (
      <Dropdown
        open
        items={[
          { key: '1', label: '选项一' },
          { key: '2', label: '选项二' },
        ]}
      >
        <button type="button">更多</button>
      </Dropdown>
    ),
    assert: [
      { k: 'data', key: 'state', value: 'open' },
      { k: 'part', name: 'trigger' },
      { k: 'part', name: 'menu' },
      { k: 'part', name: 'item' },
      { k: 'attr', on: 'trigger', key: 'aria-haspopup', value: 'menu' },
      { k: 'attr', on: 'menu', key: 'role', value: 'menu' },
      { k: 'attr', on: 'item', key: 'role', value: 'menuitem' },
    ],
  },
]
