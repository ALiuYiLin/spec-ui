/**
 * 协议级文案规范化。
 *
 * 规则（来自 Button 协议 notes）：label 恰为两个 CJK 字符、且图标槽位未渲染时，
 * 在两个字之间插入一个 U+0020。这一条不写在 CSS 里，因为它改变的是节点文本宽度，
 * 而不是视觉样式——写在样式层会导致不同实现量出的按钮宽度不一致。
 */
const TWO_CJK = /^[\u3400-\u9FFF]{2}$/

export function normalizeLabel(text: string, hasIcon: boolean): string {
  if (hasIcon) return text
  if (!TWO_CJK.test(text)) return text
  return `${text[0]} ${text.slice(1)}`
}
