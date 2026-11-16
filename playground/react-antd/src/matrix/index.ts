import type { Case } from './types'
import { cases as buttonCases } from './button'
import { cases as selectCases } from './select'
import { cases as inputCases } from './input'
import { cases as checkboxCases } from './checkbox'
import { cases as radioCases } from './radio'
import { cases as switchCases } from './switch'

export const cases: Case[] = [
  ...buttonCases.map((c) => ({ ...c, component: 'Button' })),
  ...selectCases.map((c) => ({ ...c, component: 'Select' })),
  ...inputCases.map((c) => ({ ...c, component: 'Input' })),
  ...checkboxCases.map((c) => ({ ...c, component: 'Checkbox' })),
  ...radioCases.map((c) => ({ ...c, component: 'Radio' })),
  ...switchCases.map((c) => ({ ...c, component: 'Switch' })),
]
