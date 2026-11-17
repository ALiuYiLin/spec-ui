import type { RefCase } from '../types'
import { Checkbox } from '@specmark/react'

/*** Checkbox */
export const checkboxCases: RefCase[] = [
{
    id: 'ref-checkbox-unchecked',
    component: 'Checkbox',
    render: () => <Checkbox>同意</Checkbox>,
    assert: [
      { k: 'data', key: 'state', value: 'unchecked' },
      { k: 'part', name: 'control' },
      { k: 'part', name: 'input' },
      { k: 'part', name: 'box' },
      { k: 'part', name: 'label' },
      { k: 'childOf', on: 'control', of: 'root' },
      { k: 'childOf', on: 'input', of: 'control' },
      { k: 'childOf', on: 'box', of: 'control' },
      { k: 'order', before: 'input', after: 'box' },
      { k: 'order', before: 'control', after: 'label' },
      { k: 'attr', on: 'input', key: 'type', value: 'checkbox' },
      { k: 'noAttr', on: 'input', key: 'checked' },
    ],
  },
  {
    id: 'ref-checkbox-checked',
    component: 'Checkbox',
    render: () => <Checkbox defaultChecked>同意</Checkbox>,
    assert: [
      { k: 'data', key: 'state', value: 'checked' },
      { k: 'attr', on: 'input', key: 'checked' },
    ],
  },
  {
    id: 'ref-checkbox-indeterminate',
    component: 'Checkbox',
    render: () => <Checkbox indeterminate>同意</Checkbox>,
    assert: [{ k: 'data', key: 'state', value: 'indeterminate' }],
  },
  {
    id: 'ref-checkbox-disabled',
    component: 'Checkbox',
    render: () => <Checkbox disabled>同意</Checkbox>,
    assert: [
      { k: 'data', key: 'disabled', value: 'true' },
      { k: 'attr', on: 'input', key: 'disabled' },
    ],
  },
  {
    id: 'ref-checkbox-nolabel',
    component: 'Checkbox',
    render: () => <Checkbox />,
    assert: [{ k: 'absent', name: 'label' }, { k: 'part', name: 'box' }],
  },
  {
    id: 'ref-checkbox-focus',
    component: 'Checkbox',
    actions: [{ type: 'focus', selector: '.sm-checkbox__input' }],
    render: () => <Checkbox>同意</Checkbox>,
    assert: [{ k: 'data', key: 'state', value: 'unchecked' }],
  },
]
