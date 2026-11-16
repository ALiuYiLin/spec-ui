import { h } from 'vue'
import type { VNodeChild } from 'vue'
import { Button, Checkbox, Field, Input, InputNumber, Popover, Radio, Select, Alert, Avatar, Badge, Breadcrumb, Card, Divider, Drawer, Dropdown, Empty, Modal, Progress, Result, Skeleton, Slider, Space, Spin, Statistic, Switch, Tag, Tooltip } from '@specmark/vue'

export type VueAction =
  | { type: 'focus'; selector: string }
  | { type: 'press'; key: string }
  | { type: 'click'; selector: string }

export type VueCase = {
  id: string
  component: 'Button' | 'Select' | 'Input' | 'Checkbox' | 'Radio' | 'Switch' | 'Field' | 'InputNumber' | 'Slider' | 'Tooltip' | 'Popover' | 'Modal' | 'Drawer' | 'Dropdown' | 'Divider' | 'Tag' | 'Avatar' | 'Badge' | 'Space' | 'Card' | 'Alert' | 'Spin' | 'Empty' | 'Progress' | 'Skeleton' | 'Result' | 'Statistic' | 'Breadcrumb'
  actions?: VueAction[]
  /** 断言刻意留空：Vue 实现靠通用规则 + L3 计算样式比对来判，
   *  逐用例断言只在 React 参考实现里写一份，避免两套实现各维护一遍。 */
  assert: never[]
}

const OPTIONS = [
  { value: 'a', label: '选项 A' },
  { value: 'b', label: '选项 B' },
  { value: 'c', label: '选项 C' },
]
const icon = () =>
  h(
    'svg',
    { viewBox: '0 0 16 16', width: '1em', height: '1em', fill: 'none', stroke: 'currentColor', 'aria-hidden': 'true' },
    [h('circle', { cx: 8, cy: 8, r: 6 })],
  )

/** id 与 React 用例一一对应，这样 L3 的 pair 表可以原样复用 */
export const renders: Record<string, { component: VueCase['component']; actions?: VueAction[]; render: () => VNodeChild }> = {
  'ref-button-default': { component: 'Button', render: () => h(Button, { label: '默认' }) },
  'ref-button-primary': { component: 'Button', render: () => h(Button, { variant: 'primary', label: '提交' }) },
  'ref-button-size-lg': { component: 'Button', render: () => h(Button, { variant: 'primary', size: 'lg', label: '大' }) },
  'ref-button-circle': {
    component: 'Button',
    render: () => h(Button, { variant: 'primary', shape: 'circle', icon: h(icon), ariaLabel: '搜索' }),
  },
  'ref-button-icon': {
    component: 'Button',
    render: () => h(Button, { variant: 'primary', icon: h(icon), label: '搜索' }),
  },
  'ref-button-loading': {
    component: 'Button',
    render: () => h(Button, { variant: 'primary', loading: true, label: '提交' }),
  },
  'ref-button-loading-icon': {
    component: 'Button',
    render: () => h(Button, { loading: true, icon: h(icon), label: '提交' }),
  },
  'ref-button-disabled': {
    component: 'Button',
    render: () => h(Button, { variant: 'primary', disabled: true, label: '提交' }),
  },
  'ref-button-danger-block': { component: 'Button', render: () => h(Button, { danger: true, block: true, label: '删除' }) },
  'ref-button-text': { component: 'Button', render: () => h(Button, { variant: 'text', label: '文本' }) },
  'ref-button-autospace': { component: 'Button', render: () => h(Button, { label: '提交' }) },
  'ref-button-autospace-skip-with-icon': {
    component: 'Button',
    render: () => h(Button, { icon: h(icon), label: '提交' }),
  },

  'ref-select-closed': { component: 'Select', render: () => h(Select, { options: OPTIONS }) },
  'ref-select-filled': {
    component: 'Select',
    render: () => h(Select, { options: OPTIONS, modelValue: 'b' }),
  },
  'ref-select-clear': {
    component: 'Select',
    render: () => h(Select, { options: OPTIONS, modelValue: 'b', allowClear: true }),
  },
  'ref-select-no-clear-without-value': {
    component: 'Select',
    render: () => h(Select, { options: OPTIONS, allowClear: true }),
  },
  'ref-select-open': { component: 'Select', render: () => h(Select, { options: OPTIONS, open: true }) },
  'ref-select-open-selected': {
    component: 'Select',
    render: () => h(Select, { options: OPTIONS, open: true, modelValue: 'b' }),
  },
  'ref-select-open-highlighted': {
    component: 'Select',
    actions: [
      { type: 'focus', selector: '.sm-select__input' },
      { type: 'press', key: 'ArrowDown' },
    ],
    render: () => h(Select, { options: OPTIONS }),
  },
  'ref-select-open-empty': {
    component: 'Select',
    render: () => h(Select, { options: [], open: true }),
  },
  'ref-select-focused': {
    component: 'Select',
    actions: [{ type: 'focus', selector: '.sm-select__input' }],
    render: () => h(Select, { options: OPTIONS }),
  },
  'ref-select-disabled': {
    component: 'Select',
    render: () => h(Select, { options: OPTIONS, disabled: true, modelValue: 'b' }),
  },
  'ref-select-status-error': {
    component: 'Select',
    render: () => h(Select, { options: OPTIONS, status: 'error', modelValue: 'b' }),
  },
  'ref-select-size-sm': { component: 'Select', render: () => h(Select, { options: OPTIONS, size: 'sm' }) },

  'ref-input-basic': { component: 'Input', render: () => h(Input, { placeholder: '请输入' }) },
  'ref-input-value': { component: 'Input', render: () => h(Input, { modelValue: '内容' }) },
  'ref-input-disabled': { component: 'Input', render: () => h(Input, { disabled: true, modelValue: '内容' }) },
  'ref-input-readonly': { component: 'Input', render: () => h(Input, { readOnly: true, modelValue: '内容' }) },
  'ref-input-error': { component: 'Input', render: () => h(Input, { status: 'error', modelValue: '内容' }) },
  'ref-input-sm': { component: 'Input', render: () => h(Input, { size: 'sm', placeholder: '请输入' }) },
  'ref-input-lg': { component: 'Input', render: () => h(Input, { size: 'lg', placeholder: '请输入' }) },
  'ref-input-focus': {
    component: 'Input',
    actions: [{ type: 'focus', selector: '.sm-input' }],
    render: () => h(Input, { placeholder: '请输入' }),
  },
  'ref-input-prefix': {
    component: 'Input',
    render: () => h(Input, { prefix: h('span', null, '￥'), placeholder: '请输入' }),
  },
  'ref-input-clear': {
    component: 'Input',
    render: () => h(Input, { allowClear: true, modelValue: '内容' }),
  },

  'ref-checkbox-unchecked': { component: 'Checkbox', render: () => h(Checkbox, { label: '同意' }) },
  'ref-checkbox-checked': { component: 'Checkbox', render: () => h(Checkbox, { modelValue: true, label: '同意' }) },
  'ref-checkbox-indeterminate': { component: 'Checkbox', render: () => h(Checkbox, { indeterminate: true, label: '同意' }) },
  'ref-checkbox-disabled': { component: 'Checkbox', render: () => h(Checkbox, { disabled: true, label: '同意' }) },
  'ref-checkbox-nolabel': { component: 'Checkbox', render: () => h(Checkbox) },
  'ref-checkbox-focus': {
    component: 'Checkbox',
    actions: [{ type: 'focus', selector: '.sm-checkbox__input' }],
    render: () => h(Checkbox, { label: '同意' }),
  },

  'ref-radio-unchecked': { component: 'Radio', render: () => h(Radio, { label: '同意' }) },
  'ref-radio-checked': { component: 'Radio', render: () => h(Radio, { modelValue: true, label: '同意' }) },
  'ref-radio-disabled': { component: 'Radio', render: () => h(Radio, { disabled: true, label: '同意' }) },
  'ref-radio-focus': {
    component: 'Radio',
    actions: [{ type: 'focus', selector: '.sm-radio__input' }],
    render: () => h(Radio, { label: '同意' }),
  },

  'ref-switch-off': { component: 'Switch', render: () => h(Switch) },
  'ref-switch-on': { component: 'Switch', render: () => h(Switch, { modelValue: true }) },
  'ref-switch-disabled': { component: 'Switch', render: () => h(Switch, { disabled: true }) },
  'ref-switch-focus': {
    component: 'Switch',
    actions: [{ type: 'focus', selector: '.sm-switch' }],
    render: () => h(Switch),
  },
  'ref-switch-small': { component: 'Switch', render: () => h(Switch, { size: 'sm' }) },

  'ref-field-basic': {
    component: 'Field',
    render: () => h(Field, { label: '用户名' }, { default: () => h(Input, { placeholder: '请输入' }) }),
  },
  'ref-field-required': {
    component: 'Field',
    render: () => h(Field, { label: '用户名', required: true }, { default: () => h(Input, { placeholder: '请输入' }) }),
  },
  'ref-field-error': {
    component: 'Field',
    render: () =>
      h(Field, { label: '用户名', status: 'error', error: '请填写用户名' }, {
        default: () => h(Input, { placeholder: '请输入' }),
      }),
  },

  'ref-input-number-basic': { component: 'InputNumber', render: () => h(InputNumber, { modelValue: 5 }) },
  'ref-input-number-disabled': { component: 'InputNumber', render: () => h(InputNumber, { disabled: true, modelValue: 5 }) },
  'ref-input-number-focus': {
    component: 'InputNumber',
    actions: [{ type: 'focus', selector: '.sm-input-number__input' }],
    render: () => h(InputNumber, { modelValue: 5 }),
  },
  'ref-input-number-error': { component: 'InputNumber', render: () => h(InputNumber, { status: 'error', modelValue: 5 }) },

  'ref-slider-basic': { component: 'Slider', render: () => h(Slider, { modelValue: 40 }) },
  'ref-slider-disabled': { component: 'Slider', render: () => h(Slider, { disabled: true, modelValue: 40 }) },

  'ref-tooltip-top': {
    component: 'Tooltip',
    render: () => h(Tooltip, { title: '提示文字', open: true, side: 'top' }, { default: () => h('button', { type: 'button' }, '悬停') }),
  },
  'ref-tooltip-bottom': {
    component: 'Tooltip',
    render: () => h(Tooltip, { title: '提示文字', open: true, side: 'bottom' }, { default: () => h('button', { type: 'button' }, '悬停') }),
  },

  'ref-popover-basic': {
    component: 'Popover',
    render: () => h(Popover, { title: '标题', content: '内容文字', open: true, side: 'top' }, { default: () => h('button', { type: 'button' }, '悬停') }),
  },
  'ref-popover-notitle': {
    component: 'Popover',
    render: () => h(Popover, { content: '只有内容', open: true, side: 'top' }, { default: () => h('button', { type: 'button' }, '悬停') }),
  },

  'ref-modal-basic': {
    component: 'Modal',
    render: () =>
      h(Modal, { open: true, title: '标题', footer: h('button', { type: 'button' }, '确定') }, {
        default: () => '内容文字',
      }),
  },

  'ref-drawer-basic': {
    component: 'Drawer',
    render: () => h(Drawer, { open: true, title: '标题' }, { default: () => '内容文字' }),
  },

  'ref-dropdown-basic': {
    component: 'Dropdown',
    render: () =>
      h(
        Dropdown,
        {
          open: true,
          items: [
            { key: '1', label: '选项一' },
            { key: '2', label: '选项二' },
          ],
        },
        { default: () => h('button', { type: 'button' }, '更多') },
      ),
  },

  'ref-divider-basic': { component: 'Divider', render: () => h(Divider) },
  'ref-divider-text': { component: 'Divider', render: () => h(Divider, null, { default: () => '文本' }) },
  'ref-tag-basic': { component: 'Tag', render: () => h(Tag, null, { default: () => '标签' }) },
  'ref-tag-closable': { component: 'Tag', render: () => h(Tag, { closable: true }, { default: () => '标签' }) },
  'ref-avatar-basic': { component: 'Avatar', render: () => h(Avatar, { label: '用户' }, { default: () => 'U' }) },
  'ref-avatar-square': { component: 'Avatar', render: () => h(Avatar, { shape: 'square' }, { default: () => 'U' }) },
  'ref-badge-basic': {
    component: 'Badge',
    render: () =>
      h(Badge, { count: 5 }, { default: () => h('span', { style: 'display:inline-block;width:40px;height:40px' }) }),
  },

  'ref-space-basic': {
    component: 'Space',
    render: () => h(Space, null, { default: () => [h('span', null, '一'), h('span', null, '二')] }),
  },
  'ref-card-basic': {
    component: 'Card',
    render: () =>
      h(Card, { title: '标题', extra: h('span', null, '更多') }, { default: () => '内容' }),
  },
  'ref-alert-info': { component: 'Alert', render: () => h(Alert, { type: 'info', message: '提示信息' }) },
  'ref-spin-basic': { component: 'Spin', render: () => h(Spin) },
  'ref-empty-basic': { component: 'Empty', render: () => h(Empty) },

  'ref-progress-basic': { component: 'Progress', render: () => h(Progress, { percent: 40 }) },
  'ref-skeleton-basic': { component: 'Skeleton', render: () => h(Skeleton) },
  'ref-result-info': { component: 'Result', render: () => h(Result, { status: 'info', title: '标题' }) },
  'ref-statistic-basic': { component: 'Statistic', render: () => h(Statistic, { title: '标题', value: 1234 }) },
  'ref-breadcrumb-basic': {
    component: 'Breadcrumb',
    render: () => h(Breadcrumb, { items: [{ title: '首页' }, { title: '列表' }] }),
  },
}

export const caseIds = Object.keys(renders)
