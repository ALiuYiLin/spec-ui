/**
 * 图标 glyph。
 *
 * 统一使用 lucide：React 与 Vue 两版是同一份 SVG 几何，
 * 文档演示、视觉校验、库内部实现用的都是它。
 */
import { h } from 'vue'
import { ChevronDown, Loader2, X } from 'lucide-vue-next'

export const DownIcon = () => h(ChevronDown, { 'aria-hidden': 'true' })

export const CloseIcon = () => h(X, { 'aria-hidden': 'true' })

export const SpinnerIcon = () => h(Loader2, { 'aria-hidden': 'true' })
