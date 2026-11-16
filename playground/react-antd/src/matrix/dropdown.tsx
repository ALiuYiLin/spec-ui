import { Dropdown } from 'antd'
import type { CaseDef } from './types'

const items = [
  { key: '1', label: '选项一' },
  { key: '2', label: '选项二' },
]

export const cases: CaseDef[] = [
  {
    id: 'dropdown-basic',
    state: 'open',
    portal: true,
    render: () => (
      <Dropdown open menu={{ items }} overlayClassName="case-portal">
        <button type="button">更多</button>
      </Dropdown>
    ),
  },
]
