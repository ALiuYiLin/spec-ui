import { h } from 'vue'
import { Search } from 'lucide-vue-next'

export const OPTIONS = [
  { value: 'a', label: '选项 A' },
  { value: 'b', label: '选项 B' },
  { value: 'c', label: '选项 C' },
]
export const icon = () => h(Search, { size: 16, 'aria-hidden': 'true' })

/** id 与 React 用例一一对应，这样 L3 的 pair 表可以原样复用 */
