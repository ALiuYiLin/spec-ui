import type { RefCase } from '../types'
import { Avatar } from '@specmark/react'

/*** Avatar */
export const avatarCases: RefCase[] = [
{
    id: 'ref-avatar-basic',
    component: 'Avatar',
    render: () => <Avatar label="用户">U</Avatar>,
    assert: [
      { k: 'data', key: 'shape', value: 'circle' },
      { k: 'data', key: 'size', value: 'md' },
      { k: 'attr', on: 'root', key: 'role', value: 'img' },
    ],
  },
  {
    id: 'ref-avatar-square',
    component: 'Avatar',
    render: () => <Avatar shape="square">U</Avatar>,
    assert: [{ k: 'data', key: 'shape', value: 'square' }],
  },
]
