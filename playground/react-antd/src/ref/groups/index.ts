import type { RefCase } from '../types'
import { alertCases } from './alert'
import { avatarCases } from './avatar'
import { badgeCases } from './badge'
import { breadcrumbCases } from './breadcrumb'
import { buttonCases } from './button'
import { cardCases } from './card'
import { checkboxCases } from './checkbox'
import { descriptionsCases } from './descriptions'
import { dividerCases } from './divider'
import { drawerCases } from './drawer'
import { dropdownCases } from './dropdown'
import { emptyCases } from './empty'
import { fieldCases } from './field'
import { imageCases } from './image'
import { inputNumberCases } from './input-number'
import { inputCases } from './input'
import { modalCases } from './modal'
import { popoverCases } from './popover'
import { progressCases } from './progress'
import { radioCases } from './radio'
import { resultCases } from './result'
import { selectCases } from './select'
import { skeletonCases } from './skeleton'
import { sliderCases } from './slider'
import { spaceCases } from './space'
import { spinCases } from './spin'
import { statisticCases } from './statistic'
import { stepsCases } from './steps'
import { switchCases } from './switch'
import { tagCases } from './tag'
import { timelineCases } from './timeline'
import { tooltipCases } from './tooltip'

/** 按组件分组的用例，顺序与拆分前一致 */
export const cases: RefCase[] = [
  ...alertCases,
  ...avatarCases,
  ...badgeCases,
  ...breadcrumbCases,
  ...buttonCases,
  ...cardCases,
  ...checkboxCases,
  ...descriptionsCases,
  ...dividerCases,
  ...drawerCases,
  ...dropdownCases,
  ...emptyCases,
  ...fieldCases,
  ...imageCases,
  ...inputNumberCases,
  ...inputCases,
  ...modalCases,
  ...popoverCases,
  ...progressCases,
  ...radioCases,
  ...resultCases,
  ...selectCases,
  ...skeletonCases,
  ...sliderCases,
  ...spaceCases,
  ...spinCases,
  ...statisticCases,
  ...stepsCases,
  ...switchCases,
  ...tagCases,
  ...timelineCases,
  ...tooltipCases,
]
