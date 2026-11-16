import { InputNumber } from 'antd'
import type { CaseDef } from './types'

const W = { width: 120 } as const

export const cases: CaseDef[] = [
  { id: 'input-number-basic', state: 'base', render: () => <InputNumber style={W} defaultValue={5} /> },
  {
    id: 'input-number-hover',
    state: 'hover',
    pseudo: ['hover'],
    render: () => <InputNumber style={W} defaultValue={5} />,
  },
  {
    id: 'input-number-focus',
    state: 'focus',
    actions: [{ type: 'focus', selector: '.ant-input-number-input' }],
    render: () => <InputNumber style={W} defaultValue={5} />,
  },
  { id: 'input-number-disabled', state: 'disabled', render: () => <InputNumber style={W} disabled value={5} /> },
  { id: 'input-number-error', state: 'base', render: () => <InputNumber style={W} status="error" defaultValue={5} /> },
]
