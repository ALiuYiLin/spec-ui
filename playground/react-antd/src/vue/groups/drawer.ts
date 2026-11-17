import type { VueCase } from '../types'
import { h } from 'vue'
import { Drawer } from '@specmark/vue'

/*** Drawer */
export const drawerRenders: Record<string, VueCase> = {
  'ref-drawer-basic': {
    component: 'Drawer',
    render: () => h(Drawer, { open: true, title: '标题' }, { default: () => '内容文字' }),
  },
}
