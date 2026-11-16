/**
 * 证据采集与视觉比对共用的属性白名单。
 *
 * 只有一个来源：否则采集时没存的属性，比对时会变成 undefined，
 * 于是"看起来一致"其实是"根本没比"。
 */
export const STYLE_PROPS = [
  'display', 'position', 'top', 'right', 'bottom', 'left', 'z-index', 'float', 'clear',
  'box-sizing', 'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
  'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
  'border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style',
  'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
  'border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius',
  'background-color', 'background-image', 'background-position', 'background-size', 'background-repeat',
  'box-shadow', 'outline-width', 'outline-style', 'outline-color', 'outline-offset',
  'color', 'font-family', 'font-size', 'font-weight', 'font-style', 'line-height', 'letter-spacing',
  'text-align', 'text-transform', 'text-decoration-line', 'text-shadow', 'text-overflow',
  'white-space', 'word-break',
  'opacity', 'visibility', 'overflow-x', 'overflow-y', 'transform', 'transform-origin',
  'transition-property', 'transition-duration',
  'cursor', 'pointer-events', 'user-select', 'filter', 'isolation',
  'flex-direction', 'flex-wrap', 'flex-grow', 'flex-shrink', 'flex-basis',
  'align-items', 'align-self', 'justify-content', 'gap', 'row-gap', 'column-gap',
  'vertical-align', 'content',
]

/** PascalCase 组件名 → kebab-case（InputNumber → input-number）。
 *  证据目录、协议文件名、文档路径都用它，避免三处各写一遍字符串转换。 */
export const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
