import { Avatar } from 'antd'
import type { CaseDef } from './types'

export const cases: CaseDef[] = [
  { id: 'avatar-basic', state: 'base', render: () => <Avatar>U</Avatar> },
  { id: 'avatar-square', state: 'base', render: () => <Avatar shape="square">U</Avatar> },
]
