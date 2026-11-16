import type { ReactNode } from 'react'
import { Button, Checkbox, Field, Input, InputNumber, Popover, Radio, Select, Alert, Avatar, Badge, Breadcrumb, Card, Descriptions, Divider, Drawer, Dropdown, Empty, Image, Modal, Progress, Result, Skeleton, Slider, Space, Spin, Statistic, Steps, Switch, Tag, Timeline, Tooltip } from '@specmark/react'
import type { SelectOption } from '@specmark/react'
import type { Pseudo } from '../matrix/types'

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
  component: 'Button' | 'Select' | 'Input' | 'Checkbox' | 'Radio' | 'Switch' | 'Field' | 'InputNumber' | 'Slider' | 'Tooltip' | 'Popover' | 'Modal' | 'Drawer' | 'Dropdown' | 'Divider' | 'Tag' | 'Avatar' | 'Badge' | 'Space' | 'Card' | 'Alert' | 'Spin' | 'Empty' | 'Progress' | 'Skeleton' | 'Result' | 'Statistic' | 'Breadcrumb' | 'Image' | 'Steps' | 'Timeline' | 'Descriptions'
  actions?: RefAction[]
  /** 需要 CDP 强制的伪类（与 antd 证据台同一机制） */
  pseudo?: Pseudo[]
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

const INPUT = '.sm-select__input'

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
    actions: [{ type: 'focus', selector: '.sm-checkbox__input' }],
    render: () => <Checkbox>同意</Checkbox>,
    assert: [{ k: 'data', key: 'state', value: 'unchecked' }],
  },

  // ---------------- Radio ----------------
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

  // ---------------- Switch ----------------
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

  // ---------------- Field ----------------
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

  // ---------------- InputNumber ----------------
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

  // ---------------- Slider ----------------
  {
    id: 'ref-slider-basic',
    component: 'Slider',
    render: () => <Slider defaultValue={40} />,
    assert: [
      { k: 'data', key: 'orientation', value: 'horizontal' },
      { k: 'part', name: 'rail' },
      { k: 'part', name: 'track' },
      { k: 'part', name: 'handle' },
      { k: 'order', before: 'rail', after: 'track' },
      { k: 'order', before: 'track', after: 'handle' },
      { k: 'attr', on: 'handle', key: 'role', value: 'slider' },
      { k: 'attr', on: 'handle', key: 'aria-valuenow', value: '40' },
    ],
  },
  {
    id: 'ref-slider-disabled',
    component: 'Slider',
    render: () => <Slider disabled defaultValue={40} />,
    assert: [
      { k: 'data', key: 'disabled', value: 'true' },
      { k: 'attr', on: 'handle', key: 'tabindex', value: '-1' },
    ],
  },

  // ---------------- Tooltip ----------------
  {
    id: 'ref-tooltip-top',
    component: 'Tooltip',
    render: () => (
      <Tooltip title="提示文字" open side="top">
        <button type="button">悬停</button>
      </Tooltip>
    ),
    assert: [
      { k: 'data', key: 'state', value: 'open' },
      { k: 'data', key: 'side', value: 'top' },
      { k: 'attr', on: 'root', key: 'role', value: 'tooltip' },
      { k: 'part', name: 'trigger' },
      { k: 'part', name: 'inner' },
      { k: 'part', name: 'arrow' },
      { k: 'attr', on: 'trigger', key: 'aria-describedby' },
    ],
  },
  {
    id: 'ref-tooltip-bottom',
    component: 'Tooltip',
    render: () => (
      <Tooltip title="提示文字" open side="bottom">
        <button type="button">悬停</button>
      </Tooltip>
    ),
    assert: [{ k: 'data', key: 'side', value: 'bottom' }],
  },

  // ---------------- Popover ----------------
  {
    id: 'ref-popover-basic',
    component: 'Popover',
    render: () => (
      <Popover title="标题" content="内容文字" open side="top">
        <button type="button">悬停</button>
      </Popover>
    ),
    assert: [
      { k: 'data', key: 'state', value: 'open' },
      { k: 'data', key: 'side', value: 'top' },
      { k: 'data', key: 'align', value: 'center' },
      { k: 'part', name: 'trigger' },
      { k: 'part', name: 'inner' },
      { k: 'part', name: 'title' },
      { k: 'part', name: 'content' },
      { k: 'childOf', on: 'title', of: 'inner' },
      { k: 'order', before: 'title', after: 'content' },
    ],
  },
  {
    id: 'ref-popover-notitle',
    component: 'Popover',
    render: () => (
      <Popover content="只有内容" open side="top">
        <button type="button">悬停</button>
      </Popover>
    ),
    assert: [{ k: 'absent', name: 'title' }, { k: 'part', name: 'content' }],
  },

  // ---------------- Modal ----------------
  {
    id: 'ref-modal-basic',
    component: 'Modal',
    render: () => (
      <Modal open title="标题" footer={<button type="button">确定</button>}>
        内容文字
      </Modal>
    ),
    assert: [
      { k: 'data', key: 'state', value: 'open' },
      { k: 'part', name: 'mask' },
      { k: 'part', name: 'dialog' },
      { k: 'part', name: 'header' },
      { k: 'part', name: 'title' },
      { k: 'part', name: 'body' },
      { k: 'attr', on: 'dialog', key: 'role', value: 'dialog' },
      { k: 'attr', on: 'dialog', key: 'aria-modal', value: 'true' },
      { k: 'order', before: 'mask', after: 'dialog' },
      { k: 'childOf', on: 'title', of: 'header' },
    ],
  },

  // ---------------- Drawer ----------------
  {
    id: 'ref-drawer-basic',
    component: 'Drawer',
    render: () => (
      <Drawer open title="标题">
        内容文字
      </Drawer>
    ),
    assert: [
      { k: 'data', key: 'state', value: 'open' },
      { k: 'data', key: 'side', value: 'right' },
      { k: 'part', name: 'mask' },
      { k: 'part', name: 'panel' },
      { k: 'part', name: 'header' },
      { k: 'part', name: 'body' },
      { k: 'attr', on: 'panel', key: 'role', value: 'dialog' },
      { k: 'attr', on: 'panel', key: 'aria-modal', value: 'true' },
      { k: 'order', before: 'mask', after: 'panel' },
    ],
  },

  // ---------------- Dropdown ----------------
  {
    id: 'ref-dropdown-basic',
    component: 'Dropdown',
    render: () => (
      <Dropdown
        open
        items={[
          { key: '1', label: '选项一' },
          { key: '2', label: '选项二' },
        ]}
      >
        <button type="button">更多</button>
      </Dropdown>
    ),
    assert: [
      { k: 'data', key: 'state', value: 'open' },
      { k: 'part', name: 'trigger' },
      { k: 'part', name: 'menu' },
      { k: 'part', name: 'item' },
      { k: 'attr', on: 'trigger', key: 'aria-haspopup', value: 'menu' },
      { k: 'attr', on: 'menu', key: 'role', value: 'menu' },
      { k: 'attr', on: 'item', key: 'role', value: 'menuitem' },
    ],
  },

  // ---------------- Divider ----------------
  {
    id: 'ref-divider-basic',
    component: 'Divider',
    render: () => <Divider />,
    assert: [
      { k: 'data', key: 'orientation', value: 'horizontal' },
      { k: 'data', key: 'variant', value: 'solid' },
      { k: 'absent', name: 'text' },
    ],
  },
  {
    id: 'ref-divider-text',
    component: 'Divider',
    render: () => <Divider>文本</Divider>,
    assert: [{ k: 'part', name: 'text' }],
  },

  // ---------------- Tag ----------------
  {
    id: 'ref-tag-basic',
    component: 'Tag',
    render: () => <Tag>标签</Tag>,
    assert: [{ k: 'data', key: 'tone', value: 'default' }, { k: 'absent', name: 'close' }],
  },
  {
    id: 'ref-tag-closable',
    component: 'Tag',
    render: () => <Tag closable>标签</Tag>,
    assert: [
      { k: 'part', name: 'close' },
      { k: 'attr', on: 'close', key: 'type', value: 'button' },
    ],
  },

  // ---------------- Avatar ----------------
  {
    id: 'ref-avatar-basic',
    component: 'Avatar',
    render: () => <Avatar label="用户">U</Avatar>,
    assert: [
      { k: 'data', key: 'shape', value: 'circle' },
      { k: 'data', key: 'size', value: 'md' },
      { k: 'attr', on: 'root', key: 'role', value: 'img' },
    ],
  },
  {
    id: 'ref-avatar-square',
    component: 'Avatar',
    render: () => <Avatar shape="square">U</Avatar>,
    assert: [{ k: 'data', key: 'shape', value: 'square' }],
  },

  // ---------------- Badge ----------------
  {
    id: 'ref-badge-basic',
    component: 'Badge',
    render: () => (
      <Badge count={5}>
        <span style={{ display: 'inline-block', width: 40, height: 40 }} />
      </Badge>
    ),
    assert: [{ k: 'part', name: 'count' }],
  },

  // ---------------- Space ----------------
  {
    id: 'ref-space-basic',
    component: 'Space',
    render: () => (
      <Space>
        <span>一</span>
        <span>二</span>
      </Space>
    ),
    assert: [
      { k: 'data', key: 'direction', value: 'horizontal' },
      { k: 'data', key: 'size', value: 'md' },
      { k: 'part', name: 'item' },
    ],
  },

  // ---------------- Card ----------------
  {
    id: 'ref-card-basic',
    component: 'Card',
    render: () => (
      <Card title="标题" extra={<span>更多</span>}>
        内容
      </Card>
    ),
    assert: [
      { k: 'part', name: 'header' },
      { k: 'part', name: 'title' },
      { k: 'part', name: 'body' },
      { k: 'order', before: 'header', after: 'body' },
      { k: 'childOf', on: 'title', of: 'header' },
    ],
  },

  // ---------------- Alert ----------------
  {
    id: 'ref-alert-info',
    component: 'Alert',
    render: () => <Alert type="info" message="提示信息" />,
    assert: [
      { k: 'data', key: 'type', value: 'info' },
      { k: 'attr', on: 'root', key: 'role', value: 'alert' },
      { k: 'part', name: 'message' },
      { k: 'absent', name: 'close' },
    ],
  },

  // ---------------- Spin ----------------
  {
    id: 'ref-spin-basic',
    component: 'Spin',
    render: () => <Spin />,
    assert: [
      { k: 'data', key: 'size', value: 'md' },
      { k: 'attr', on: 'root', key: 'role', value: 'status' },
      { k: 'part', name: 'dot' },
      { k: 'absent', name: 'tip' },
    ],
  },

  // ---------------- Empty ----------------
  {
    id: 'ref-empty-basic',
    component: 'Empty',
    render: () => <Empty />,
    assert: [
      { k: 'part', name: 'image' },
      { k: 'part', name: 'description' },
      { k: 'order', before: 'image', after: 'description' },
    ],
  },

  // ---------------- Progress ----------------
  {
    id: 'ref-progress-basic',
    component: 'Progress',
    render: () => <Progress percent={40} />,
    assert: [
      { k: 'attr', on: 'root', key: 'role', value: 'progressbar' },
      { k: 'part', name: 'rail' },
      { k: 'part', name: 'bar' },
      { k: 'order', before: 'rail', after: 'bar' },
      { k: 'data', key: 'status', value: 'normal' },
    ],
  },

  // ---------------- Skeleton ----------------
  {
    id: 'ref-skeleton-basic',
    component: 'Skeleton',
    render: () => <Skeleton />,
    assert: [
      { k: 'attr', on: 'root', key: 'aria-busy', value: 'true' },
      { k: 'part', name: 'title' },
      { k: 'part', name: 'paragraph' },
      { k: 'part', name: 'item' },
      { k: 'order', before: 'title', after: 'paragraph' },
    ],
  },

  // ---------------- Result ----------------
  {
    id: 'ref-result-info',
    component: 'Result',
    render: () => <Result status="info" title="标题" />,
    assert: [
      { k: 'data', key: 'status', value: 'info' },
      { k: 'part', name: 'icon' },
      { k: 'part', name: 'title' },
      { k: 'absent', name: 'subtitle' },
      { k: 'order', before: 'icon', after: 'title' },
    ],
  },

  // ---------------- Statistic ----------------
  {
    id: 'ref-statistic-basic',
    component: 'Statistic',
    render: () => <Statistic title="标题" value={1234} />,
    assert: [
      { k: 'part', name: 'title' },
      { k: 'part', name: 'value' },
      { k: 'order', before: 'title', after: 'value' },
    ],
  },

  // ---------------- Breadcrumb ----------------
  {
    id: 'ref-breadcrumb-basic',
    component: 'Breadcrumb',
    render: () => <Breadcrumb items={[{ title: '首页' }, { title: '列表' }]} />,
    assert: [
      { k: 'part', name: 'item' },
      { k: 'part', name: 'separator' },
      { k: 'attr', on: 'root', key: 'aria-label' },
      { k: 'attr', on: 'separator', key: 'aria-hidden', value: 'true' },
    ],
  },

  // ---------------- Image ----------------
  {
    id: 'ref-image-basic',
    component: 'Image',
    render: () => <Image src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width={40} alt="" />,
    assert: [
      { k: 'part', name: 'img' },
      { k: 'attr', on: 'img', key: 'src' },
      { k: 'attr', on: 'img', key: 'alt' },
    ],
  },

  // ---------------- Steps ----------------
  {
    id: 'ref-steps-basic',
    component: 'Steps',
    render: () => <Steps current={1} items={[{ title: '第一步' }, { title: '第二步' }]} />,
    assert: [
      { k: 'data', key: 'direction', value: 'horizontal' },
      { k: 'part', name: 'item' },
      { k: 'part', name: 'title' },
    ],
  },

  // ---------------- Timeline ----------------
  {
    id: 'ref-timeline-basic',
    component: 'Timeline',
    render: () => <Timeline items={[{ content: '事件一' }, { content: '事件二' }]} />,
    assert: [
      { k: 'part', name: 'item' },
      { k: 'part', name: 'dot' },
      { k: 'part', name: 'content' },
      { k: 'attr', on: 'item', key: 'data-tone', value: 'default' },
    ],
  },

  // ---------------- Descriptions ----------------
  {
    id: 'ref-descriptions-basic',
    component: 'Descriptions',
    render: () => <Descriptions items={[{ label: '标签', content: '内容' }]} />,
    assert: [
      { k: 'part', name: 'item' },
      { k: 'part', name: 'label' },
      { k: 'part', name: 'content' },
      { k: 'order', before: 'label', after: 'content' },
    ],
  },
]
