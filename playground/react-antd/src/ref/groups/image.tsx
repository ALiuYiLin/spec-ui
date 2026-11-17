import type { RefCase } from '../types'
import { Image } from '@specmark/react'

/*** Image */
export const imageCases: RefCase[] = [
{
    id: 'ref-image-basic',
    component: 'Image',
    render: () => <Image src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width={40} alt="" />,
    assert: [
      { k: 'part', name: 'img' },
      { k: 'attr', on: 'img', key: 'src' },
      { k: 'attr', on: 'img', key: 'alt' },
    ],
  },
]
