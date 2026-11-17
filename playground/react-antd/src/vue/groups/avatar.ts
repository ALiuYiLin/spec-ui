import type { VueCase } from '../types'
import { h } from 'vue'
import { Avatar } from '@specmark/vue'

/*** Avatar */
export const avatarRenders: Record<string, VueCase> = {
  'ref-avatar-basic': { component: 'Avatar', render: () => h(Avatar, { label: '用户' }, { default: () => 'U' }) },
  'ref-avatar-square': { component: 'Avatar', render: () => h(Avatar, { shape: 'square' }, { default: () => 'U' }) },
}
