import { Breadcrumb } from 'antd'
import type { CaseDef } from './types'

export const cases: CaseDef[] = [
  {
    id: 'breadcrumb-basic',
    state: 'base',
    render: () => (
      <Breadcrumb
        items={[{ title: '首页' }, { title: '列表' }]}
        style={{ width: 200 }}
      />
    ),
  },
]
