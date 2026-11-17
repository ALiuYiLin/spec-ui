import type { VueCase } from '../types'
import { h } from 'vue'
import { Button } from '@specmark/vue'
import { icon } from '../shared'

/*** Button */
export const buttonRenders: Record<string, VueCase> = {
  'ref-button-round': { component: 'Button', render: () => h(Button, { variant: 'solid', shape: 'round' }, { default: () => '圆角' }) },
  'ref-button-block': { component: 'Button', render: () => h(Button, { variant: 'solid', block: true }, { default: () => '块级' }) },
  'ref-button-disabled-dashed': { component: 'Button', render: () => h(Button, { variant: 'dashed', disabled: true }, { default: () => '提交' }) },
  'ref-button-disabled-text': { component: 'Button', render: () => h(Button, { variant: 'text', disabled: true }, { default: () => '提交' }) },
  'ref-button-disabled-link': { component: 'Button', render: () => h(Button, { variant: 'link', disabled: true }, { default: () => '提交' }) },
  'ref-button-default': { component: 'Button', render: () => h(Button, { label: '默认' }) },
  'ref-button-tone-success': { component: 'Button', render: () => h(Button, { tone: 'success', variant: 'solid' }, { default: () => '提交' }) },
  'ref-button-tone-warning': { component: 'Button', render: () => h(Button, { tone: 'warning', variant: 'solid' }, { default: () => '提交' }) },
  'ref-button-primary': { component: 'Button', render: () => h(Button, { variant: 'solid', label: '提交' }) },
  'ref-button-size-lg': { component: 'Button', render: () => h(Button, { variant: 'solid', size: 'lg', label: '大' }) },
  'ref-button-circle': {
    component: 'Button',
    render: () => h(Button, { variant: 'solid', shape: 'circle', icon: h(icon), ariaLabel: '搜索' }),
  },
  'ref-button-icon': {
    component: 'Button',
    render: () => h(Button, { variant: 'solid', icon: h(icon), label: '搜索' }),
  },
  'ref-button-loading': {
    component: 'Button',
    render: () => h(Button, { variant: 'solid', loading: true, label: '提交' }),
  },
  'ref-button-loading-icon': {
    component: 'Button',
    render: () => h(Button, { variant: 'solid', loading: true, icon: h(icon), label: '提交' }),
  },
  'ref-button-disabled': {
    component: 'Button',
    render: () => h(Button, { variant: 'solid', disabled: true, label: '提交' }),
  },
  'ref-button-danger-block': { component: 'Button', render: () => h(Button, { tone: 'danger', block: true, label: '删除' }) },
  'ref-button-text': { component: 'Button', render: () => h(Button, { variant: 'text', label: '文本' }) },
  'ref-button-autospace': { component: 'Button', render: () => h(Button, { label: '提交' }) },
  'ref-button-autospace-skip-with-icon': {
    component: 'Button',
    render: () => h(Button, { icon: h(icon), label: '提交' }),
  },
}
