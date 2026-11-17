import type { RefCase } from '../types'
import { Field, Input } from '@specmark/react'

/*** Field */
export const fieldCases: RefCase[] = [
{
    id: 'ref-field-basic',
    component: 'Field',
    render: () => (
      <Field label="用户名">
        <Input placeholder="请输入" />
      </Field>
    ),
    assert: [
      { k: 'data', key: 'status', value: 'default' },
      { k: 'part', name: 'label' },
      { k: 'part', name: 'control' },
      { k: 'absent', name: 'error' },
      { k: 'childOf', on: 'label', of: 'root' },
      { k: 'order', before: 'label', after: 'control' },
    ],
  },
  {
    id: 'ref-field-required',
    component: 'Field',
    render: () => (
      <Field label="用户名" required>
        <Input placeholder="请输入" />
      </Field>
    ),
    assert: [{ k: 'data', key: 'required', value: 'true' }],
  },
  {
    id: 'ref-field-error',
    component: 'Field',
    render: () => (
      <Field label="用户名" status="error" error="请填写用户名">
        <Input placeholder="请输入" />
      </Field>
    ),
    assert: [
      { k: 'data', key: 'status', value: 'error' },
      { k: 'part', name: 'error' },
      { k: 'attr', on: 'error', key: 'role', value: 'alert' },
      { k: 'order', before: 'control', after: 'error' },
    ],
  },
]
