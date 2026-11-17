import type { VueCase } from '../types'
import { h } from 'vue'
import { Image } from '@specmark/vue'

/*** Image */
export const imageRenders: Record<string, VueCase> = {
  'ref-image-basic': {
    component: 'Image',
    render: () => h(Image, { src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', width: 40, alt: '' }),
  },
}
