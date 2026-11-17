import type { RefCase } from '../types'
import { Radio } from '@specmark/react'

/*** Radio */
export const radioCases: RefCase[] = [
{
    id: 'ref-radio-unchecked',
    component: 'Radio',
    render: () => <Radio>同意</Radio>,
    assert: [
      { k: 'data', key: 'state', value: 'unchecked' },
      { k: 'part', name: 'input' },
      { k: 'part', name: 'box' },
      { k: 'childOf', on: 'input', of: 'control' },
      { k: 'attr', on: 'input', key: 'type', value: 'radio' },
      { k: 'noAttr', on: 'input', key: 'checked' },
    ],
  },
  {
    id: 'ref-radio-checked',
    component: 'Radio',
    render: () => <Radio defaultChecked>同意</Radio>,
    assert: [
      { k: 'data', key: 'state', value: 'checked' },
      { k: 'attr', on: 'input', key: 'checked' },
    ],
  },
  {
    id: 'ref-radio-disabled',
    component: 'Radio',
    render: () => <Radio disabled>同意</Radio>,
    assert: [
      { k: 'data', key: 'disabled', value: 'true' },
      { k: 'attr', on: 'input', key: 'disabled' },
    ],
  },
  {
    id: 'ref-radio-focus',
    component: 'Radio',
    actions: [{ type: 'focus', selector: '.sm-radio__input' }],
    render: () => <Radio>同意</Radio>,
    assert: [{ k: 'data', key: 'state', value: 'unchecked' }],
  },
  {
    id: 'ref-radio-disabled-checked',
    component: 'Radio',
    render: () => <Radio disabled defaultChecked>选项</Radio>,
    assert: [
      { k: 'data', key: 'state', value: 'checked' },
      { k: 'data', key: 'disabled', value: 'true' },
    ],
  },
]
