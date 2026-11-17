import { Select } from 'antd'
import type { CaseDef } from './types'

const options = [
  { value: 'a', label: '选项 A' },
  { value: 'b', label: '选项 B' },
  { value: 'c', label: '选项 C' },
]

/** 统一基础 props：固定宽度 + 给浮层打标记，便于抓取脚本收集 portal */
const P = {
  options,
  style: { width: 200 },
  popupClassName: 'case-portal',
} as const

const INPUT = '.ant-select-selection-search-input'

export const cases: CaseDef[] = [
  // ---- 关闭态 ----
  { id: 'select-closed-empty', state: 'closed', render: () => <Select {...P} placeholder="请选择" /> },
  { id: 'select-closed-filled', state: 'closed', render: () => <Select {...P} defaultValue="b" /> },
  {
    id: 'select-closed-filled-clear',
    state: 'closed',
    render: () => <Select {...P} defaultValue="b" allowClear />,
  },
  {
    id: 'select-closed-filled-hover',
    state: 'hover',
    pseudo: ['hover'],
    render: () => <Select {...P} defaultValue="b" allowClear />,
  },

  // ---- 打开态（portal）----
  { id: 'select-open', state: 'open', portal: true, render: () => <Select {...P} open placeholder="请选择" /> },
  { id: 'select-open-filled', state: 'open', portal: true, render: () => <Select {...P} open value="b" /> },
  {
    id: 'select-open-highlighted',
    state: 'open',
    portal: true,
    actions: [
      { type: 'focus', selector: INPUT },
      { type: 'press', key: 'ArrowDown' },
    ],
    render: () => <Select {...P} placeholder="请选择" />,
  },
  {
    id: 'select-open-empty',
    state: 'open',
    portal: true,
    render: () => <Select {...P} open options={[]} placeholder="请选择" />,
  },

  // ---- 焦点 ----
  {
    id: 'select-focused',
    state: 'focus-within',
    actions: [{ type: 'focus', selector: INPUT }],
    render: () => <Select {...P} placeholder="请选择" />,
  },

  // ---- 布尔 / 语义 ----
  { id: 'select-disabled', state: 'disabled', render: () => <Select {...P} disabled value="b" /> },
  { id: 'select-status-error', state: 'closed', render: () => <Select {...P} status="error" value="b" /> },
  { id: 'select-status-warning', state: 'closed', render: () => <Select {...P} status="warning" value="b" /> },

  // ---- 尺寸 / 变体 ----
  { id: 'select-size-sm', state: 'closed', render: () => <Select {...P} size="small" placeholder="请选择" /> },
  { id: 'select-size-lg', state: 'closed', render: () => <Select {...P} size="large" placeholder="请选择" /> },
  { id: 'select-variant-borderless', state: 'closed', render: () => <Select {...P} variant="borderless" placeholder="请选择" /> },
  { id: 'select-variant-filled', state: 'closed', render: () => <Select {...P} variant="filled" placeholder="请选择" /> },
  { id: 'select-no-arrow', state: 'closed', render: () => <Select {...P} showArrow={false} placeholder="请选择" /> },
]
