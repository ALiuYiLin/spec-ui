import type { RefCase } from '../types'
import { Switch } from '@specmark/react'

/*** Switch */
export const switchCases: RefCase[] = [
{
    id: 'ref-switch-off',
    component: 'Switch',
    render: () => <Switch />,
    assert: [
      { k: 'data', key: 'state', value: 'off' },
      { k: 'attr', on: 'root', key: 'role', value: 'switch' },
      { k: 'attr', on: 'root', key: 'aria-checked', value: 'false' },
      { k: 'part', name: 'handle' },
      { k: 'childOf', on: 'handle', of: 'root' },
    ],
  },
  {
    id: 'ref-switch-on',
    component: 'Switch',
    render: () => <Switch defaultChecked />,
    assert: [
      { k: 'data', key: 'state', value: 'on' },
      { k: 'attr', on: 'root', key: 'aria-checked', value: 'true' },
    ],
  },
  {
    id: 'ref-switch-disabled',
    component: 'Switch',
    render: () => <Switch disabled />,
    assert: [
      { k: 'data', key: 'disabled', value: 'true' },
      { k: 'attr', on: 'root', key: 'disabled' },
    ],
  },
  {
    id: 'ref-switch-focus',
    component: 'Switch',
    actions: [{ type: 'focus', selector: '.sm-switch' }],
    render: () => <Switch />,
    assert: [{ k: 'data', key: 'state', value: 'off' }],
  },
  {
    id: 'ref-switch-small',
    component: 'Switch',
    render: () => <Switch size="sm" />,
    assert: [{ k: 'data', key: 'size', value: 'sm' }],
  },
  {
    id: 'ref-switch-disabled-on',
    component: 'Switch',
    render: () => <Switch defaultChecked disabled />,
    assert: [
      { k: 'data', key: 'state', value: 'on' },
      { k: 'data', key: 'disabled', value: 'true' },
    ],
  },
  {
    id: 'ref-switch-text',
    component: 'Switch',
    render: () => <Switch defaultChecked>开</Switch>,
    assert: [{ k: 'part', name: 'inner' }],
  },
]
