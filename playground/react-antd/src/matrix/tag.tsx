import { Tag } from 'antd'
import type { CaseDef } from './types'

export const cases: CaseDef[] = [
  { id: 'tag-basic', state: 'base', render: () => <Tag>标签</Tag> },
  { id: 'tag-closable', state: 'base', render: () => <Tag closable>标签</Tag> },
]
