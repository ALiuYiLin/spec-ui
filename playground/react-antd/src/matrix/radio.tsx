import { Radio } from 'antd'
import type { CaseDef } from './types'

export const cases: CaseDef[] = [
  { id: 'radio-unchecked', state: 'base', render: () => <Radio>同意</Radio> },
  { id: 'radio-checked', state: 'base', render: () => <Radio defaultChecked>同意</Radio> },
  { id: 'radio-disabled', state: 'disabled', render: () => <Radio disabled>同意</Radio> },
  {
    id: 'radio-disabled-checked',
    state: 'disabled',
    render: () => (
      <Radio disabled defaultChecked>
        同意
      </Radio>
    ),
  },
  { id: 'radio-hover', state: 'hover', pseudo: ['hover'], render: () => <Radio>同意</Radio> },
  {
    id: 'radio-focus',
    state: 'focus',
    actions: [{ type: 'focus', selector: '.ant-radio-input' }],
    render: () => <Radio>同意</Radio>,
  },
]
