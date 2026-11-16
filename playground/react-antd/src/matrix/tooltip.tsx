import { Tooltip } from 'antd'
import type { CaseDef } from './types'

export const cases: CaseDef[] = [
  {
    id: 'tooltip-top',
    state: 'open',
    portal: true,
    render: () => (
      <Tooltip title="提示文字" placement="top" open overlayClassName="case-portal">
        <button type="button">悬停</button>
      </Tooltip>
    ),
  },
  {
    id: 'tooltip-bottom',
    state: 'open',
    portal: true,
    render: () => (
      <Tooltip title="提示文字" placement="bottom" open overlayClassName="case-portal">
        <button type="button">悬停</button>
      </Tooltip>
    ),
  },
]
