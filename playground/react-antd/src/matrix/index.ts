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
]
