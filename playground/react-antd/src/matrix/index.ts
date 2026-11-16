import type { Case } from './types'
import { cases as buttonCases } from './button'
import { cases as selectCases } from './select'

export const cases: Case[] = [
  ...buttonCases.map((c) => ({ ...c, component: 'Button' })),
  ...selectCases.map((c) => ({ ...c, component: 'Select' })),
]
