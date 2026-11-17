import type { VueCase } from '../types'
import { h } from 'vue'
import { Slider } from '@specmark/vue'

/*** Slider */
export const sliderRenders: Record<string, VueCase> = {
  'ref-slider-basic': { component: 'Slider', render: () => h(Slider, { modelValue: 40 }) },
  'ref-slider-disabled': { component: 'Slider', render: () => h(Slider, { disabled: true, modelValue: 40 }) },

}
