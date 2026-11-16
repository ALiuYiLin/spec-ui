import { Form, Input } from 'antd'
import type { CaseDef } from './types'

const W = { width: 240 } as const

const wrap = (children: React.ReactNode) => (
  <Form layout="vertical" style={W} component={false}>
    {children}
  </Form>
)

export const cases: CaseDef[] = [
  {
    id: 'field-basic',
    state: 'base',
    render: () =>
      wrap(
        <Form.Item label="用户名">
          <Input placeholder="请输入" />
        </Form.Item>,
      ),
  },
  {
    id: 'field-required',
    state: 'base',
    render: () =>
      wrap(
        <Form.Item label="用户名" required>
          <Input placeholder="请输入" />
        </Form.Item>,
      ),
  },
  {
    id: 'field-error',
    state: 'base',
    render: () =>
      wrap(
        <Form.Item label="用户名" validateStatus="error" help="请填写用户名">
          <Input placeholder="请输入" />
        </Form.Item>,
      ),
  },
]
