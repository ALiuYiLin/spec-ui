import type { RefCase } from '../types'
import { Tooltip } from '@specmark/react'

/*** Tooltip */
export const tooltipCases: RefCase[] = [
{
    id: 'ref-tooltip-top',
    component: 'Tooltip',
    render: () => (
      <Tooltip title="提示文字" open side="top">
        <button type="button">悬停</button>
      </Tooltip>
    ),
    assert: [
      { k: 'data', key: 'state', value: 'open' },
      { k: 'data', key: 'side', value: 'top' },
      { k: 'attr', on: 'root', key: 'role', value: 'tooltip' },
      { k: 'part', name: 'trigger' },
      { k: 'part', name: 'inner' },
      { k: 'part', name: 'arrow' },
      { k: 'attr', on: 'trigger', key: 'aria-describedby' },
    ],
  },
  {
    id: 'ref-tooltip-bottom',
    component: 'Tooltip',
    render: () => (
      <Tooltip title="提示文字" open side="bottom">
        <button type="button">悬停</button>
      </Tooltip>
    ),
    assert: [{ k: 'data', key: 'side', value: 'bottom' }],
  },
]
