/** 参考实现用例共用的常量：图标、下拉选项、选择器。 */
import { Search } from 'lucide-react'
import type { SelectOption } from '@specmark/react'

export const icon = <Search size={16} aria-hidden="true" />

export const OPTIONS: SelectOption[] = [
  { value: 'a', label: '选项 A' },
  { value: 'b', label: '选项 B' },
  { value: 'c', label: '选项 C' },
]

export const INPUT = '.sm-select__input'
