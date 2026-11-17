/**
 * 图标 glyph。
 *
 * 统一使用 lucide：React 与 Vue 两版是同一份 SVG 几何，
 * 文档演示、视觉校验、库内部实现用的都是它，不会出现「三个来源三种形状」。
 */
import { ChevronDown, Loader2, X } from 'lucide-react'

/** 下拉箭头 */
export function DownIcon() {
  return <ChevronDown aria-hidden="true" />
}

/** 关闭 */
export function CloseIcon() {
  return <X aria-hidden="true" />
}

/** 加载指示器（旋转由外层 CSS 负责） */
export function SpinnerIcon() {
  return <Loader2 aria-hidden="true" />
}
