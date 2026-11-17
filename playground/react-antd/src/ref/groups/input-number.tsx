import type { RefCase } from '../types'
import { InputNumber } from '@specmark/react'

/*** InputNumber */
export const inputNumberCases: RefCase[] = [
{
    id: 'ref-input-number-basic',
    component: 'InputNumber',
    render: () => <InputNumber defaultValue={5} />,
    assert: [
      { k: 'data', key: 'size', value: 'md' },
      { k: 'part', name: 'wrap' },
      { k: 'part', name: 'input' },
      { k: 'childOf', on: 'input', of: 'wrap' },
      { k: 'attr', on: 'wrap', key: 'role', value: 'spinbutton' },
      { k: 'part', name: 'handler' },
    ],
  },
  {
    id: 'ref-input-number-disabled',
    component: 'InputNumber',
    render: () => <InputNumber disabled value={5} />,
    assert: [
      { k: 'data', key: 'disabled', value: 'true' },
      { k: 'attr', on: 'input', key: 'disabled' },
      { k: 'absent', name: 'handler' },
    ],
  },
  {
    id: 'ref-input-number-focus',
    component: 'InputNumber',
    actions: [{ type: 'focus', selector: '.sm-input-number__input' }],
    render: () => <InputNumber defaultValue={5} />,
    assert: [{ k: 'data', key: 'size', value: 'md' }],
  },
  {
    id: 'ref-input-number-error',
    component: 'InputNumber',
    render: () => <InputNumber status="error" defaultValue={5} />,
    assert: [
      { k: 'data', key: 'status', value: 'error' },
      { k: 'attr', on: 'input', key: 'aria-invalid', value: 'true' },
    ],
  },
]
