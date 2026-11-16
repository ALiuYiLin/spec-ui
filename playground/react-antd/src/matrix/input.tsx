import { Input } from 'antd'
import type { CaseDef } from './types'

const W = { width: 200 } as const

export const cases: CaseDef[] = [
  // ---- 无前后缀（根就是 input）----
  { id: 'input-basic', state: 'base', render: () => <Input style={W} placeholder="请输入" /> },
  { id: 'input-value', state: 'base', render: () => <Input style={W} defaultValue="内容" /> },
  { id: 'input-hover', state: 'hover', pseudo: ['hover'], render: () => <Input style={W} placeholder="请输入" /> },
  {
    id: 'input-focus',
    state: 'focus',
    actions: [{ type: 'focus', selector: '.ant-input' }],
    render: () => <Input style={W} placeholder="请输入" />,
  },
  { id: 'input-disabled', state: 'disabled', render: () => <Input style={W} disabled defaultValue="内容" /> },
  { id: 'input-readonly', state: 'readonly', render: () => <Input style={W} readOnly defaultValue="内容" /> },
  { id: 'input-error', state: 'base', render: () => <Input style={W} status="error" defaultValue="内容" /> },
  { id: 'input-warning', state: 'base', render: () => <Input style={W} status="warning" defaultValue="内容" /> },
  { id: 'input-sm', state: 'base', render: () => <Input style={W} size="small" placeholder="请输入" /> },
  { id: 'input-lg', state: 'base', render: () => <Input style={W} size="large" placeholder="请输入" /> },
  { id: 'input-variant-filled', state: 'base', render: () => <Input style={W} variant="filled" placeholder="请输入" /> },
  {
    id: 'input-variant-borderless',
    state: 'base',
    render: () => <Input style={W} variant="borderless" placeholder="请输入" />,
  },

  // ---- 有前后缀（根是包裹元素）----
  {
    id: 'input-prefix',
    state: 'base',
    render: () => <Input style={W} prefix={<span>￥</span>} placeholder="请输入" />,
  },
  {
    id: 'input-suffix',
    state: 'base',
    render: () => <Input style={W} suffix={<span>元</span>} placeholder="请输入" />,
  },
  { id: 'input-clear', state: 'base', render: () => <Input style={W} allowClear defaultValue="内容" /> },
  {
    id: 'input-clear-hover',
    state: 'hover',
    pseudo: ['hover'],
    render: () => <Input style={W} allowClear defaultValue="内容" />,
  },
]
