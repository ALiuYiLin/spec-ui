import type { VueCase } from '../types'
import { h } from 'vue'
import { Tag } from '@specmark/vue'

/*** Tag */
export const tagRenders: Record<string, VueCase> = {
  'ref-tag-basic': { component: 'Tag', render: () => h(Tag, null, { default: () => '标签' }) },
  'ref-tag-closable': { component: 'Tag', render: () => h(Tag, { closable: true }, { default: () => '标签' }) },
}
