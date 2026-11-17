import type { RefCase } from '../types'
import { Input } from '@specmark/react'

/*** Input */
export const inputCases: RefCase[] = [
  {
    id: 'ref-input-warning',
    component: 'Input',
    render: () => (
      <Input status="warning" defaultValue="内容" />
    ),
    assert: [{ k: 'data', key: 'status', value: 'warning' }],
  },
  {
    id: 'ref-input-filled',
    component: 'Input',
    render: () => (
      <Input variant="filled" placeholder="请输入" />
    ),
    assert: [{ k: 'data', key: 'variant', value: 'filled' }],
  },
  {
    id: 'ref-input-borderless',
    component: 'Input',
    render: () => (
      <Input variant="borderless" placeholder="请输入" />
    ),
    assert: [{ k: 'data', key: 'variant', value: 'borderless' }],
  },
  {
    id: 'ref-input-basic',
    component: 'Input',
    render: () => <Input placeholder="请输入" />,
    assert: [
      { k: 'data', key: 'variant', value: 'outlined' },
      { k: 'data', key: 'size', value: 'md' },
      { k: 'data', key: 'status', value: 'default' },
      { k: 'attr', on: 'root', key: 'placeholder', value: '请输入' },
      { k: 'absent', name: 'field' },
      { k: 'absent', name: 'prefix' },
    ],
  },
  {
    id: 'ref-input-value',
    component: 'Input',
    render: () => <Input defaultValue="内容" />,
    assert: [{ k: 'absent', name: 'field' }],
  },
  {
    id: 'ref-input-disabled',
    component: 'Input',
    render: () => <Input disabled defaultValue="内容" />,
    assert: [
      { k: 'data', key: 'disabled', value: 'true' },
      { k: 'attr', on: 'root', key: 'disabled' },
    ],
  },
  {
    id: 'ref-input-readonly',
    component: 'Input',
    render: () => <Input readOnly defaultValue="内容" />,
    assert: [
      { k: 'data', key: 'readonly', value: 'true' },
      { k: 'attr', on: 'root', key: 'readonly' },
    ],
  },
  {
    id: 'ref-input-error',
    component: 'Input',
    render: () => <Input status="error" defaultValue="内容" />,
    assert: [
      { k: 'data', key: 'status', value: 'error' },
      { k: 'attr', on: 'root', key: 'aria-invalid', value: 'true' },
    ],
  },
  {
    id: 'ref-input-sm',
    component: 'Input',
    render: () => <Input size="sm" placeholder="请输入" />,
    assert: [{ k: 'data', key: 'size', value: 'sm' }],
  },
  {
    id: 'ref-input-lg',
    component: 'Input',
    render: () => <Input size="lg" placeholder="请输入" />,
    assert: [{ k: 'data', key: 'size', value: 'lg' }],
  },
  {
    id: 'ref-input-focus',
    component: 'Input',
    actions: [{ type: 'focus', selector: '.sm-input' }],
    render: () => <Input placeholder="请输入" />,
    assert: [{ k: 'data', key: 'variant', value: 'outlined' }],
  },
  {
    id: 'ref-input-prefix',
    component: 'Input',
    render: () => <Input prefix={<span>￥</span>} placeholder="请输入" />,
    assert: [
      { k: 'part', name: 'prefix' },
      { k: 'part', name: 'field' },
      { k: 'childOf', on: 'field', of: 'root' },
      { k: 'attr', on: 'field', key: 'placeholder', value: '请输入' },
      { k: 'order', before: 'prefix', after: 'field' },
    ],
  },
  {
    id: 'ref-input-clear',
    component: 'Input',
    render: () => <Input allowClear defaultValue="内容" />,
    assert: [
      { k: 'part', name: 'field' },
      { k: 'part', name: 'clear' },
      { k: 'absent', name: 'suffix' },
    ],
  },
  {
    id: 'ref-input-suffix',
    component: 'Input',
    render: () => <Input suffix={<span>元</span>} defaultValue="内容" />,
    assert: [
      { k: 'part', name: 'field' },
      { k: 'part', name: 'suffix' },
      { k: 'order', before: 'field', after: 'suffix' },
    ],
  },
]
