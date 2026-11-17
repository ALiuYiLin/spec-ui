import type { RefCase } from '../types'
import { Slider } from '@specmark/react'

/*** Slider */
export const sliderCases: RefCase[] = [
{
    id: 'ref-slider-basic',
    component: 'Slider',
    render: () => <Slider defaultValue={40} />,
    assert: [
      { k: 'data', key: 'orientation', value: 'horizontal' },
      { k: 'part', name: 'rail' },
      { k: 'part', name: 'track' },
      { k: 'part', name: 'handle' },
      { k: 'order', before: 'rail', after: 'track' },
      { k: 'order', before: 'track', after: 'handle' },
      { k: 'attr', on: 'handle', key: 'role', value: 'slider' },
      { k: 'attr', on: 'handle', key: 'aria-valuenow', value: '40' },
    ],
  },
  {
    id: 'ref-slider-disabled',
    component: 'Slider',
    render: () => <Slider disabled defaultValue={40} />,
    assert: [
      { k: 'data', key: 'disabled', value: 'true' },
      { k: 'attr', on: 'handle', key: 'tabindex', value: '-1' },
    ],
  },
  {
    id: 'ref-slider-max',
    component: 'Slider',
    render: () => <Slider max={100} value={100} />,
    assert: [{ k: 'part', name: 'track' }],
  },
  {
    id: 'ref-slider-min',
    component: 'Slider',
    render: () => <Slider min={0} value={0} />,
    assert: [{ k: 'part', name: 'track' }],
  },
  {
    id: 'ref-slider-focus',
    component: 'Slider',
    render: () => <Slider value={40} />,
    assert: [{ k: 'part', name: 'track' }],
  },
]
