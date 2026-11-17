import type { ReactNode } from 'react'
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
