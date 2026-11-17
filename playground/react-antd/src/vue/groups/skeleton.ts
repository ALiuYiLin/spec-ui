import type { VueCase } from '../types'
import { h } from 'vue'
import { Skeleton } from '@specmark/vue'

/*** Skeleton */
export const skeletonRenders: Record<string, VueCase> = {
  'ref-skeleton-basic': { component: 'Skeleton', render: () => h(Skeleton) },
}
