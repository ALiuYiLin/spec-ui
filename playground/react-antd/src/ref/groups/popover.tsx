import type { RefCase } from '../types'
import { Popover } from '@specmark/react'

/*** Popover */
export const popoverCases: RefCase[] = [
{
    id: 'ref-popover-basic',
    component: 'Popover',
    render: () => (
      <Popover title="标题" content="内容文字" open side="top">
        <button type="button">悬停</button>
      </Popover>
    ),
    assert: [
      { k: 'data', key: 'state', value: 'open' },
      { k: 'data', key: 'side', value: 'top' },
      { k: 'data', key: 'align', value: 'center' },
      { k: 'part', name: 'trigger' },
      { k: 'part', name: 'inner' },
      { k: 'part', name: 'title' },
      { k: 'part', name: 'content' },
      { k: 'childOf', on: 'title', of: 'inner' },
      { k: 'order', before: 'title', after: 'content' },
    ],
  },
  {
    id: 'ref-popover-notitle',
    component: 'Popover',
    render: () => (
      <Popover content="只有内容" open side="top">
        <button type="button">悬停</button>
      </Popover>
    ),
    assert: [{ k: 'absent', name: 'title' }, { k: 'part', name: 'content' }],
  },
]
