import { Fragment } from 'react'

export type BreadcrumbItem = { title: string }

export type BreadcrumbProps = {
  items: BreadcrumbItem[]
  label?: string
}

export function Breadcrumb({ items, label = '面包屑' }: BreadcrumbProps) {
  return (
    <nav className="sm-breadcrumb" aria-label={label}>
      <ol className="sm-breadcrumb__list">
        {items.map((item, index) => (
        <Fragment key={index}>
          <li className="sm-breadcrumb__item">
            <span className="sm-breadcrumb__link">{item.title}</span>
          </li>
          {index < items.length - 1 ? (
            <li className="sm-breadcrumb__separator" aria-hidden="true">
              /
            </li>
          ) : null}
        </Fragment>
        ))}
      </ol>
    </nav>
  )
}
