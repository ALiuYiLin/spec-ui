import { Fragment } from 'react'

export type BreadcrumbItem = { title: string }

export type BreadcrumbProps = {
  items: BreadcrumbItem[]
  label?: string
}

export function Breadcrumb({ items, label = '面包屑' }: BreadcrumbProps) {
  return (
    <nav className="sm-breadcrumb" aria-label={label}>
      {items.map((item, index) => (
        <Fragment key={index}>
          <span className="sm-breadcrumb__item">{item.title}</span>
          {index < items.length - 1 ? (
            <span className="sm-breadcrumb__separator" aria-hidden="true">
              /
            </span>
          ) : null}
        </Fragment>
      ))}
    </nav>
  )
}
