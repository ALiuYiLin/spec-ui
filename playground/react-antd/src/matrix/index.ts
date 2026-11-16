import type { Case } from './types'
import { cases as buttonCases } from './button'
import { cases as selectCases } from './select'
import { cases as inputCases } from './input'
import { cases as checkboxCases } from './checkbox'
import { cases as radioCases } from './radio'
import { cases as switchCases } from './switch'
import { cases as fieldCases } from './field'
import { cases as inputNumberCases } from './input-number'
import { cases as sliderCases } from './slider'
import { cases as tooltipCases } from './tooltip'
import { cases as popoverCases } from './popover'
import { cases as modalCases } from './modal'
import { cases as drawerCases } from './drawer'
import { cases as dropdownCases } from './dropdown'
import { cases as dividerCases } from './divider'
import { cases as tagCases } from './tag'
import { cases as avatarCases } from './avatar'
import { cases as badgeCases } from './badge'
import { cases as spaceCases } from './space'
import { cases as cardCases } from './card'
import { cases as alertCases } from './alert'
import { cases as spinCases } from './spin'
import { cases as emptyCases } from './empty'
import { cases as progressCases } from './progress'
import { cases as skeletonCases } from './skeleton'
import { cases as resultCases } from './result'
import { cases as statisticCases } from './statistic'
import { cases as breadcrumbCases } from './breadcrumb'
import { cases as imageCases } from './image'
import { cases as stepsCases } from './steps'
import { cases as timelineCases } from './timeline'
import { cases as descriptionsCases } from './descriptions'

export const cases: Case[] = [
  ...buttonCases.map((c) => ({ ...c, component: 'Button' })),
  ...selectCases.map((c) => ({ ...c, component: 'Select' })),
  ...inputCases.map((c) => ({ ...c, component: 'Input' })),
  ...checkboxCases.map((c) => ({ ...c, component: 'Checkbox' })),
  ...radioCases.map((c) => ({ ...c, component: 'Radio' })),
  ...switchCases.map((c) => ({ ...c, component: 'Switch' })),
  ...fieldCases.map((c) => ({ ...c, component: 'Field' })),
  ...inputNumberCases.map((c) => ({ ...c, component: 'InputNumber' })),
  ...sliderCases.map((c) => ({ ...c, component: 'Slider' })),
  ...tooltipCases.map((c) => ({ ...c, component: 'Tooltip' })),
  ...popoverCases.map((c) => ({ ...c, component: 'Popover' })),
  ...modalCases.map((c) => ({ ...c, component: 'Modal' })),
  ...drawerCases.map((c) => ({ ...c, component: 'Drawer' })),
  ...dropdownCases.map((c) => ({ ...c, component: 'Dropdown' })),
  ...dividerCases.map((c) => ({ ...c, component: 'Divider' })),
  ...tagCases.map((c) => ({ ...c, component: 'Tag' })),
  ...avatarCases.map((c) => ({ ...c, component: 'Avatar' })),
  ...badgeCases.map((c) => ({ ...c, component: 'Badge' })),
  ...spaceCases.map((c) => ({ ...c, component: 'Space' })),
  ...cardCases.map((c) => ({ ...c, component: 'Card' })),
  ...alertCases.map((c) => ({ ...c, component: 'Alert' })),
  ...spinCases.map((c) => ({ ...c, component: 'Spin' })),
  ...emptyCases.map((c) => ({ ...c, component: 'Empty' })),
  ...progressCases.map((c) => ({ ...c, component: 'Progress' })),
  ...skeletonCases.map((c) => ({ ...c, component: 'Skeleton' })),
  ...resultCases.map((c) => ({ ...c, component: 'Result' })),
  ...statisticCases.map((c) => ({ ...c, component: 'Statistic' })),
  ...breadcrumbCases.map((c) => ({ ...c, component: 'Breadcrumb' })),
  ...imageCases.map((c) => ({ ...c, component: 'Image' })),
  ...stepsCases.map((c) => ({ ...c, component: 'Steps' })),
  ...timelineCases.map((c) => ({ ...c, component: 'Timeline' })),
  ...descriptionsCases.map((c) => ({ ...c, component: 'Descriptions' })),
]
