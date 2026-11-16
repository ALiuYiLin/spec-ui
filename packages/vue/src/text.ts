/**
 * 协议级文案规范化（与 React 实现同一规则）。
 *
 * 来自证据：primary / default / dashed / round / danger / block / loading 两个汉字插空格，
 * text / link 不插，带 icon 不插。它改的是节点文本，不是样式，所以必须由实现负责。
 */
const TWO_CJK = /^[\u3400-\u9FFF]{2}$/

export function normalizeLabel(text: string, hasIcon: boolean, variant: string): string {
  if (hasIcon) return text
  if (variant === 'text' || variant === 'link') return text
  if (!TWO_CJK.test(text)) return text
  return `${text[0]} ${text.slice(1)}`
}
