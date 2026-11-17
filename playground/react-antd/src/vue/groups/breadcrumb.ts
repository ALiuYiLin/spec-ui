import type { VueCase } from '../types'
import { h } from 'vue'
import { Breadcrumb } from '@specmark/vue'

/*** Breadcrumb */
export const breadcrumbRenders: Record<string, VueCase> = {
  'ref-breadcrumb-basic': {
    component: 'Breadcrumb',
    render: () => h(Breadcrumb, { items: [{ title: '首页' }, { title: '列表' }] }),
  },
}
