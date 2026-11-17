import type { VNodeChild } from 'vue'

export type VueAction =
  | { type: 'focus'; selector: string }
  | { type: 'press'; key: string }
  | { type: 'click'; selector: string }

export type VueCase = {
  id?: string
  component: 'Button' | 'Select' | 'Input' | 'Checkbox' | 'Radio' | 'Switch' | 'Field' | 'InputNumber' | 'Slider' | 'Tooltip' | 'Popover' | 'Modal' | 'Drawer' | 'Dropdown' | 'Divider' | 'Tag' | 'Avatar' | 'Badge' | 'Space' | 'Card' | 'Alert' | 'Spin' | 'Empty' | 'Progress' | 'Skeleton' | 'Result' | 'Statistic' | 'Breadcrumb' | 'Image' | 'Steps' | 'Timeline' | 'Descriptions'
  actions?: VueAction[]
  render: () => VNodeChild
  /** 断言刻意留空：Vue 实现靠通用规则 + L3 计算样式比对来判，
   *  逐用例断言只在 React 参考实现里写一份，避免两套实现各维护一遍。 */
  assert?: never[]
}
