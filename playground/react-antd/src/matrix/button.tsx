import { Button } from 'antd'
import type { CaseDef } from './types'

// 占位图标：沿用 antd SearchOutlined 的路径，保证图标槽位的尺寸真实
const searchIcon = (
  <svg viewBox="0 0 1024 1024" width="1em" height="1em" aria-hidden="true" focusable="false">
    <path
      fill="currentColor"
      d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"
    />
  </svg>
)

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
