import { Slider } from 'antd'
import type { CaseDef } from './types'

const W = { width: 200 } as const

export const cases: CaseDef[] = [
  { id: 'slider-basic', state: 'base', render: () => <Slider style={W} defaultValue={40} /> },
  { id: 'slider-min', state: 'base', render: () => <Slider style={W} defaultValue={0} /> },
  { id: 'slider-max', state: 'base', render: () => <Slider style={W} defaultValue={100} /> },
  { id: 'slider-hover', state: 'hover', pseudo: ['hover'], render: () => <Slider style={W} defaultValue={40} /> },
  {
    id: 'slider-focus',
    state: 'focus',
    actions: [{ type: 'focus', selector: '.ant-slider-handle' }],
    render: () => <Slider style={W} defaultValue={40} />,
  },
  { id: 'slider-disabled', state: 'disabled', render: () => <Slider style={W} disabled defaultValue={40} /> },
]
