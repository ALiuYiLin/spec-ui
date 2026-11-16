import { Checkbox } from 'antd'
import type { CaseDef } from './types'

export const cases: CaseDef[] = [
  { id: 'checkbox-unchecked', state: 'base', render: () => <Checkbox>同意</Checkbox> },
  { id: 'checkbox-checked', state: 'base', render: () => <Checkbox defaultChecked>同意</Checkbox> },
  { id: 'checkbox-indeterminate', state: 'base', render: () => <Checkbox indeterminate>同意</Checkbox> },
  { id: 'checkbox-disabled', state: 'disabled', render: () => <Checkbox disabled>同意</Checkbox> },
  {
    id: 'checkbox-disabled-checked',
    state: 'disabled',
    render: () => (
      <Checkbox disabled defaultChecked>
        同意
      </Checkbox>
    ),
  },
  { id: 'checkbox-hover', state: 'hover', pseudo: ['hover'], render: () => <Checkbox>同意</Checkbox> },
  {
    id: 'checkbox-hover-checked',
    state: 'hover',
    pseudo: ['hover'],
    render: () => <Checkbox defaultChecked>同意</Checkbox>,
  },
  {
    id: 'checkbox-focus',
    state: 'focus',
    actions: [{ type: 'focus', selector: '.ant-checkbox-input' }],
    render: () => <Checkbox>同意</Checkbox>,
  },
  { id: 'checkbox-no-label', state: 'base', render: () => <Checkbox /> },
]
