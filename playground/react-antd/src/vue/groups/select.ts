import type { VueCase } from '../types'
import { h } from 'vue'
import { Select } from '@specmark/vue'
import { OPTIONS } from '../shared'

/*** Select */
export const selectRenders: Record<string, VueCase> = {
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

  'ref-select-variant-filled': { component: 'Select', render: () => h(Select, { options: OPTIONS, variant: 'filled', placeholder: '请选择' }) },
  'ref-select-variant-borderless': { component: 'Select', render: () => h(Select, { options: OPTIONS, variant: 'borderless', placeholder: '请选择' }) },
  'ref-select-status-warning': { component: 'Select', render: () => h(Select, { options: OPTIONS, status: 'warning', placeholder: '请选择' }) },
  'ref-select-size-lg': { component: 'Select', render: () => h(Select, { options: OPTIONS, size: 'lg', placeholder: '请选择' }) },
}
