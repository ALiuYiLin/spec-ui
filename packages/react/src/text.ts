/**
 * 协议级文案规范化。
 *
 * 规则来自证据（artifacts/button 的实测宽度）：
 *   primary / default / dashed / round / danger / block / loading  → "提 交"（插空格）
 *   text / link                                                   → "文本"（不插）
 *   带 icon                                                       → 不插
 *
 * 它改的是节点文本，不是样式，所以必须由实现负责；写在样式层会导致不同实现量出的按钮宽度不一致。
 */
const TWO_CJK = /^[\u3400-\u9FFF]{2}$/

export function normalizeLabel(text: string, hasIcon: boolean, variant: string): string {
  if (hasIcon) return text
  if (variant === 'text' || variant === 'link') return text
  if (!TWO_CJK.test(text)) return text
  return `${text[0]} ${text.slice(1)}`
}
