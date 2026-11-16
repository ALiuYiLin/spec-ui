import { Image } from 'antd'
import type { CaseDef } from './types'

const SRC =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

export const cases: CaseDef[] = [
  { id: 'image-basic', state: 'base', render: () => <Image src={SRC} width={40} alt="" preview={false} /> },
]
