import type { ReactNode } from 'react'

export type Pseudo = 'hover' | 'active' | 'focus' | 'focus-visible' | 'focus-within'

export type Action =
  | { type: 'focus'; selector: string }
  | { type: 'press'; key: string }
  | { type: 'click'; selector: string }

export type Case = {
  id: string
  component: string
  state: string
  /** 需要在根节点上强制的伪类（CDP forcePseudoState） */
  pseudo?: Pseudo[]
  /** 采集前需要执行的真实交互（键盘/焦点/点击） */
  actions?: Action[]
  /** 该用例会渲染 portal 浮层，抓取时要额外收集 .case-portal */
  portal?: boolean
  render: () => ReactNode
}

/** 各组件矩阵里写的形状：component 由聚合层补齐 */
export type CaseDef = Omit<Case, 'component'>
