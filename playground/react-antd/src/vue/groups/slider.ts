import type { VueCase } from '../types'
import { h } from 'vue'
import { Slider } from '@specmark/vue'

/*** Slider */
export const sliderRenders: Record<string, VueCase> = {
  'ref-slider-basic': { component: 'Slider', render: () => h(Slider, { modelValue: 40 }) },
  'ref-slider-disabled': { component: 'Slider', render: () => h(Slider, { disabled: true, modelValue: 40 }) },

  'ref-slider-max': { component: 'Slider', render: () => h(Slider, { max: 100, modelValue: 100, ariaLabel: '最大' }) },
  'ref-slider-min': { component: 'Slider', render: () => h(Slider, { min: 0, modelValue: 0, ariaLabel: '最小' }) },
  'ref-slider-focus': { component: 'Slider', render: () => h(Slider, { modelValue: 40, ariaLabel: '聚焦' }) },
}
