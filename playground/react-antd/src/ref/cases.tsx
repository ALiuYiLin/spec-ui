import type { ReactNode } from 'react'
import { Button, Checkbox, Input, Select } from '@actview/react'
import type { SelectOption } from '@actview/react'

export type Assertion = {
  k: 'part' | 'absent' | 'data' | 'noData' | 'attr' | 'noAttr' | 'order' | 'text' | 'childOf' | 'parentIsBody'
  /** 断言目标部件（class 后缀名），默认 root */
  on?: string
  /** k=part / k=absent 时的部件名 */
  name?: string
  /** k=childOf 时的父级部件名 */
  of?: string
  key?: string
  value?: string
  count?: number
  index?: number
  before?: string
  after?: string
}

export type RefAction =
  | { type: 'focus'; selector: string }
  | { type: 'press'; key: string }
  | { type: 'click'; selector: string }

export type RefCase = {
  id: string
  component: 'Button' | 'Select'
  actions?: RefAction[]
  render: () => ReactNode
  assert: Assertion[]
}

const icon = (
  <svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" stroke="currentColor" aria-hidden="true">
    <circle cx="8" cy="8" r="6" />
  </svg>
)

const OPTIONS: SelectOption[] = [
  { value: 'a', label: '选项 A' },
  { value: 'b', label: '选项 B' },
  { value: 'c', label: '选项 C' },
]

const INPUT = '.av-select__input'

export const cases: RefCase[] = [
  // ---------------- Button ----------------
  {
    id: 'ref-button-default',
    component: 'Button',
    render: () => <Button>默认</Button>,
    assert: [
      { k: 'part', name: 'label', count: 1 },
      { k: 'childOf', on: 'label', of: 'root' },
      { k: 'absent', name: 'spinner' },
      { k: 'absent', name: 'icon' },
      { k: 'data', key: 'variant', value: 'default' },
      { k: 'data', key: 'size', value: 'md' },
      { k: 'data', key: 'shape', value: 'default' },
      { k: 'noData', key: 'disabled' },
      { k: 'noData', key: 'loading' },
    ],
  },
  {
    id: 'ref-button-primary',
    component: 'Button',
    render: () => <Button variant="primary">提交</Button>,
    assert: [
      { k: 'data', key: 'variant', value: 'primary' },
      { k: 'part', name: 'label' },
      { k: 'noAttr', on: 'root', key: 'aria-busy' },
    ],
  },
  {
    id: 'ref-button-size-lg',
    component: 'Button',
    render: () => (
      <Button variant="primary" size="lg">
        大
      </Button>
    ),
    assert: [{ k: 'data', key: 'size', value: 'lg' }],
  },
  {
    id: 'ref-button-circle',
    component: 'Button',
    render: () => (
      <Button variant="primary" shape="circle" icon={icon} aria-label="搜索" />
    ),
    assert: [
      { k: 'data', key: 'shape', value: 'circle' },
      { k: 'attr', on: 'root', key: 'aria-label', value: '搜索' },
      { k: 'part', name: 'icon' },
      { k: 'part', name: 'label' },
    ],
  },
  {
    id: 'ref-button-icon',
    component: 'Button',
    render: () => (
      <Button variant="primary" icon={icon}>
        搜索
      </Button>
    ),
    assert: [
      { k: 'part', name: 'icon' },
      { k: 'childOf', on: 'icon', of: 'root' },
      { k: 'part', name: 'label' },
      { k: 'absent', name: 'spinner' },
      { k: 'order', before: 'icon', after: 'label' },
    ],
  },
  {
    id: 'ref-button-loading',
    component: 'Button',
    render: () => (
      <Button variant="primary" loading>
        提交
      </Button>
    ),
    assert: [
      { k: 'data', key: 'loading', value: 'true' },
      { k: 'attr', on: 'root', key: 'aria-busy', value: 'true' },
      { k: 'part', name: 'spinner' },
      { k: 'childOf', on: 'spinner', of: 'root' },
      { k: 'absent', name: 'icon' },
      { k: 'noAttr', on: 'root', key: 'disabled' },
    ],
  },
  {
    id: 'ref-button-loading-icon',
    component: 'Button',
    render: () => (
      <Button loading icon={icon}>
        提交
      </Button>
    ),
    assert: [
      { k: 'part', name: 'spinner' },
      { k: 'absent', name: 'icon' },
      { k: 'data', key: 'loading', value: 'true' },
    ],
  },
  {
    id: 'ref-button-disabled',
    component: 'Button',
    render: () => (
      <Button variant="primary" disabled>
        提交
      </Button>
    ),
    assert: [
      { k: 'data', key: 'disabled', value: 'true' },
      { k: 'attr', on: 'root', key: 'disabled' },
      { k: 'noData', key: 'loading' },
      { k: 'noAttr', on: 'root', key: 'aria-busy' },
    ],
  },
  {
    id: 'ref-button-danger-block',
    component: 'Button',
    render: () => (
      <Button danger block>
        删除
      </Button>
    ),
    assert: [
      { k: 'data', key: 'danger', value: 'true' },
      { k: 'data', key: 'block', value: 'true' },
    ],
  },
  {
    id: 'ref-button-text',
    component: 'Button',
    render: () => (
      <Button variant="text">文本</Button>
    ),
    assert: [{ k: 'data', key: 'variant', value: 'text' }],
  },
  {
    id: 'ref-button-autospace',
    component: 'Button',
    render: () => <Button>提交</Button>,
    assert: [{ k: 'text', on: 'label', value: '提 交' }],
  },
  {
    id: 'ref-button-autospace-skip-with-icon',
    component: 'Button',
    render: () => (
      <Button icon={icon}>提交</Button>
    ),
    assert: [{ k: 'text', on: 'label', value: '提交' }],
  },

  // ---------------- Select ----------------
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

  // ---------------- Input ----------------
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
    actions: [{ type: 'focus', selector: '.av-input' }],
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

  // ---------------- Checkbox ----------------
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
    actions: [{ type: 'focus', selector: '.av-checkbox__input' }],
    render: () => <Checkbox>同意</Checkbox>,
    assert: [{ k: 'data', key: 'state', value: 'unchecked' }],
  },
]
