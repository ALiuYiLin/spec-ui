import { Popover } from 'antd'
import type { CaseDef } from './types'

export const cases: CaseDef[] = [
  {
    id: 'popover-basic',
    state: 'open',
    portal: true,
    render: () => (
      <Popover title="标题" content="内容文字" open overlayClassName="case-portal">
        <button type="button">悬停</button>
      </Popover>
    ),
  },
  {
    id: 'popover-notitle',
    state: 'open',
    portal: true,
    render: () => (
      <Popover content="只有内容" open overlayClassName="case-portal">
        <button type="button">悬停</button>
      </Popover>
    ),
  },
]
