import { Button } from 'antd'
import type { CaseDef } from './types'

// 图标用 lucide：React 与 Vue 两版几何完全一致，图标槽位与 svg 才能逐项比对
import { Search } from 'lucide-react'

const searchIcon = <Search size={16} aria-hidden="true" />

const base = (props: Parameters<typeof Button>[0]) => () => <Button {...props} />

export const toneCases: CaseDef[] = [
  {
    id: 'button-tone-success',
    state: 'base',
    render: () => (
      <Button color="green" variant="solid">
        提交
      </Button>
    ),
  },
  {
    id: 'button-tone-warning',
    state: 'base',
    render: () => (
      <Button color="gold" variant="solid">
        提交
      </Button>
    ),
  },
]

export const cases: CaseDef[] = [
  // ---- 默认 / 变体 ----
  { id: 'button-primary-md', state: 'base', render: base({ type: 'primary', children: '提交' }) },
  { id: 'button-default-md', state: 'base', render: base({ children: '默认' }) },
  { id: 'button-dashed-md', state: 'base', render: base({ type: 'dashed', children: '虚线' }) },
  { id: 'button-text-md', state: 'base', render: base({ type: 'text', children: '文本' }) },
  { id: 'button-link-md', state: 'base', render: base({ type: 'link', children: '链接' }) },

  // ---- 尺寸 / 形状 ----
  { id: 'button-size-sm', state: 'base', render: base({ type: 'primary', size: 'small', children: '小' }) },
  { id: 'button-size-lg', state: 'base', render: base({ type: 'primary', size: 'large', children: '大' }) },
  { id: 'button-shape-round', state: 'base', render: base({ type: 'primary', shape: 'round', children: '圆角' }) },
  { id: 'button-shape-circle', state: 'base', render: base({ type: 'primary', shape: 'circle', icon: searchIcon }) },

  // ---- 语义 ----
  { id: 'button-danger-primary', state: 'base', render: base({ type: 'primary', danger: true, children: '删除' }) },
  { id: 'button-danger-default', state: 'base', render: base({ danger: true, children: '删除' }) },

  // ---- 布尔状态 ----
  { id: 'button-loading', state: 'loading', render: base({ type: 'primary', loading: true, children: '提交' }) },
  {
    id: 'button-loading-icon',
    state: 'loading',
    render: base({ type: 'primary', loading: true, icon: searchIcon, children: '提交' }),
  },
  { id: 'button-disabled-dashed', state: 'disabled', render: base({ type: 'dashed', disabled: true, children: '提交' }) },
  { id: 'button-disabled-text', state: 'disabled', render: base({ type: 'text', disabled: true, children: '提交' }) },
  { id: 'button-disabled-link', state: 'disabled', render: base({ type: 'link', disabled: true, children: '提交' }) },
  { id: 'button-disabled', state: 'disabled', render: base({ type: 'primary', disabled: true, children: '提交' }) },
  { id: 'button-icon', state: 'base', render: base({ type: 'primary', icon: searchIcon, children: '搜索' }) },
  { id: 'button-block', state: 'base', render: base({ type: 'primary', block: true, children: '块级' }) },

  // ---- 交互态（CDP 强制伪类）----
  { id: 'button-primary-md-hover', state: 'hover', pseudo: ['hover'], render: base({ type: 'primary', children: '提交' }) },
  { id: 'button-primary-md-active', state: 'active', pseudo: ['active'], render: base({ type: 'primary', children: '提交' }) },
  { id: 'button-primary-md-focus', state: 'focus', pseudo: ['focus'], render: base({ type: 'primary', children: '提交' }) },
  {
    id: 'button-primary-md-focus-visible',
    state: 'focus-visible',
    pseudo: ['focus', 'focus-visible'],
    render: base({ type: 'primary', children: '提交' }),
  },
  { id: 'button-default-md-hover', state: 'hover', pseudo: ['hover'], render: base({ children: '默认' }) },
  { id: 'button-default-md-active', state: 'active', pseudo: ['active'], render: base({ children: '默认' }) },
  {
    id: 'button-default-md-focus-visible',
    state: 'focus-visible',
    pseudo: ['focus', 'focus-visible'],
    render: base({ children: '默认' }),
  },
  { id: 'button-text-md-hover', state: 'hover', pseudo: ['hover'], render: base({ type: 'text', children: '文本' }) },
  { id: 'button-link-md-hover', state: 'hover', pseudo: ['hover'], render: base({ type: 'link', children: '链接' }) },
  {
    id: 'button-disabled-hover',
    state: 'hover',
    pseudo: ['hover'],
    render: base({ type: 'primary', disabled: true, children: '提交' }),
  },
]
