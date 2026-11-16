import { Drawer } from 'antd'
import type { CaseDef } from './types'

export const cases: CaseDef[] = [
  {
    id: 'drawer-basic',
    state: 'open',
    portal: false,
    render: () => (
      <Drawer open title="标题" getContainer={false} onClose={() => undefined}>
        内容文字
      </Drawer>
    ),
  },
]
