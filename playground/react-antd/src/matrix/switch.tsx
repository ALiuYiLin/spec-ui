import { Switch } from 'antd'
import type { CaseDef } from './types'

export const cases: CaseDef[] = [
  { id: 'switch-off', state: 'base', render: () => <Switch /> },
  { id: 'switch-on', state: 'base', render: () => <Switch defaultChecked /> },
  { id: 'switch-disabled', state: 'disabled', render: () => <Switch disabled /> },
  { id: 'switch-disabled-on', state: 'disabled', render: () => <Switch disabled defaultChecked /> },
  { id: 'switch-hover', state: 'hover', pseudo: ['hover'], render: () => <Switch /> },
  {
    id: 'switch-focus',
    state: 'focus',
    actions: [{ type: 'focus', selector: '.ant-switch' }],
    render: () => <Switch />,
  },
  { id: 'switch-small', state: 'base', render: () => <Switch size="small" /> },
  {
    id: 'switch-text',
    state: 'on',
    render: () => <Switch defaultChecked checkedChildren="开" unCheckedChildren="关" />,
  },
]
