import type { VueCase } from '../types'
import { alertRenders } from './alert'
import { avatarRenders } from './avatar'
import { badgeRenders } from './badge'
import { breadcrumbRenders } from './breadcrumb'
import { buttonRenders } from './button'
import { cardRenders } from './card'
import { checkboxRenders } from './checkbox'
import { descriptionsRenders } from './descriptions'
import { dividerRenders } from './divider'
import { drawerRenders } from './drawer'
import { dropdownRenders } from './dropdown'
import { emptyRenders } from './empty'
import { fieldRenders } from './field'
import { imageRenders } from './image'
import { inputNumberRenders } from './input-number'
import { inputRenders } from './input'
import { modalRenders } from './modal'
import { popoverRenders } from './popover'
import { progressRenders } from './progress'
import { radioRenders } from './radio'
import { resultRenders } from './result'
import { selectRenders } from './select'
import { skeletonRenders } from './skeleton'
import { sliderRenders } from './slider'
import { spaceRenders } from './space'
import { spinRenders } from './spin'
import { statisticRenders } from './statistic'
import { stepsRenders } from './steps'
import { switchRenders } from './switch'
import { tagRenders } from './tag'
import { timelineRenders } from './timeline'
import { tooltipRenders } from './tooltip'

export const renders: Record<string, VueCase> = {
  ...alertRenders,
  ...avatarRenders,
  ...badgeRenders,
  ...breadcrumbRenders,
  ...buttonRenders,
  ...cardRenders,
  ...checkboxRenders,
  ...descriptionsRenders,
  ...dividerRenders,
  ...drawerRenders,
  ...dropdownRenders,
  ...emptyRenders,
  ...fieldRenders,
  ...imageRenders,
  ...inputNumberRenders,
  ...inputRenders,
  ...modalRenders,
  ...popoverRenders,
  ...progressRenders,
  ...radioRenders,
  ...resultRenders,
  ...selectRenders,
  ...skeletonRenders,
  ...sliderRenders,
  ...spaceRenders,
  ...spinRenders,
  ...statisticRenders,
  ...stepsRenders,
  ...switchRenders,
  ...tagRenders,
  ...timelineRenders,
  ...tooltipRenders,
}
