import type { RefCase } from '../types'
import { Select } from '@specmark/react'
import { OPTIONS, INPUT } from '../shared'

/*** Select */
export const selectCases: RefCase[] = [
{
    id: 'ref-select-closed',
    component: 'Select',
    render: () => <Select options={OPTIONS} />,
    assert: [
      { k: 'data', key: 'state', value: 'closed' },
      { k: 'part', name: 'placeholder' },
      { k: 'absent', name: 'value' },
      { k: 'part', name: 'input' },
      { k: 'attr', on: 'input', key: 'aria-expanded', value: 'false' },
      { k: 'noAttr', on: 'input', key: 'aria-activedescendant' },
      { k: 'absent', name: 'dropdown' },
    ],
  },
  {
    id: 'ref-select-filled',
    component: 'Select',
    render: () => <Select options={OPTIONS} defaultValue="b" />,
    assert: [
      { k: 'part', name: 'value' },
      { k: 'text', on: 'value', value: '选项 B' },
      { k: 'absent', name: 'placeholder' },
    ],
  },
  {
    id: 'ref-select-clear',
    component: 'Select',
    render: () => <Select options={OPTIONS} defaultValue="b" allowClear />,
    assert: [{ k: 'part', name: 'clear' }, { k: 'part', name: 'arrow' }],
  },
  {
    id: 'ref-select-no-clear-without-value',
    component: 'Select',
    render: () => <Select options={OPTIONS} allowClear />,
    assert: [{ k: 'absent', name: 'clear' }],
  },
  {
    id: 'ref-select-open',
    component: 'Select',
    render: () => <Select options={OPTIONS} open />,
    assert: [
      { k: 'data', key: 'state', value: 'open' },
      { k: 'part', name: 'dropdown' },
      { k: 'parentIsBody', on: 'dropdown' },
      { k: 'data', on: 'dropdown', key: 'state', value: 'open' },
      { k: 'part', name: 'listbox' },
      { k: 'part', name: 'option', count: 3 },
      { k: 'attr', on: 'input', key: 'aria-expanded', value: 'true' },
      { k: 'attr', on: 'input', key: 'aria-controls' },
    ],
  },
  {
    id: 'ref-select-open-selected',
    component: 'Select',
    render: () => <Select options={OPTIONS} open value="b" />,
    assert: [
      { k: 'data', on: 'option', index: 1, key: 'selected', value: 'true' },
      { k: 'attr', on: 'option', index: 1, key: 'aria-selected', value: 'true' },
      { k: 'noData', on: 'option', index: 0, key: 'selected' },
    ],
  },
  {
    id: 'ref-select-open-highlighted',
    component: 'Select',
    actions: [
      { type: 'focus', selector: INPUT },
      { type: 'press', key: 'ArrowDown' },
    ],
    render: () => <Select options={OPTIONS} />,
    assert: [
      { k: 'data', key: 'state', value: 'open' },
      { k: 'data', on: 'option', index: 0, key: 'highlighted', value: 'true' },
      { k: 'attr', on: 'input', key: 'aria-activedescendant' },
      { k: 'part', name: 'dropdown' },
    ],
  },
  {
    id: 'ref-select-open-empty',
    component: 'Select',
    render: () => <Select options={[]} open />,
    assert: [
      { k: 'part', name: 'empty' },
      { k: 'absent', name: 'option' },
      { k: 'noAttr', on: 'input', key: 'aria-activedescendant' },
    ],
  },
  {
    id: 'ref-select-disabled',
    component: 'Select',
    render: () => <Select options={OPTIONS} disabled value="b" />,
    assert: [
      { k: 'data', key: 'disabled', value: 'true' },
      { k: 'attr', on: 'input', key: 'disabled' },
      { k: 'data', key: 'state', value: 'closed' },
      { k: 'absent', name: 'clear' },
    ],
  },
  {
    id: 'ref-select-status-error',
    component: 'Select',
    render: () => <Select options={OPTIONS} status="error" value="b" />,
    assert: [{ k: 'data', key: 'status', value: 'error' }],
  },
  {
    id: 'ref-select-focused',
    component: 'Select',
    actions: [{ type: 'focus', selector: INPUT }],
    render: () => <Select options={OPTIONS} />,
    assert: [{ k: 'data', key: 'state', value: 'closed' }],
  },
  {
    id: 'ref-select-size-sm',
    component: 'Select',
    render: () => <Select options={OPTIONS} size="sm" />,
    assert: [{ k: 'data', key: 'size', value: 'sm' }],
  },
  {
    id: 'ref-select-variant-filled',
    component: 'Select',
    render: () => (
      <Select options={OPTIONS} variant="filled" placeholder="请选择" />
    ),
    assert: [{ k: 'data', key: 'variant', value: 'filled' }],
  },
  {
    id: 'ref-select-variant-borderless',
    component: 'Select',
    render: () => (
      <Select options={OPTIONS} variant="borderless" placeholder="请选择" />
    ),
    assert: [{ k: 'data', key: 'variant', value: 'borderless' }],
  },
  {
    id: 'ref-select-status-warning',
    component: 'Select',
    render: () => (
      <Select options={OPTIONS} status="warning" placeholder="请选择" />
    ),
    assert: [{ k: 'data', key: 'status', value: 'warning' }],
  },
  {
    id: 'ref-select-size-lg',
    component: 'Select',
    render: () => (
      <Select options={OPTIONS} size="lg" placeholder="请选择" />
    ),
    assert: [{ k: 'data', key: 'size', value: 'lg' }],
  },
]
