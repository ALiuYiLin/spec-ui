export type ImageProps = {
  src: string
  alt?: string
  width?: number
  height?: number
}

export function Image({ src, alt = '', width, height }: ImageProps) {
  return (
    <div className="sm-image">
      <img className="sm-image__img" src={src} alt={alt} width={width} height={height} />
    </div>
  )
}
