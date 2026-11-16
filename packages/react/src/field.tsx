import type { ReactNode } from 'react'

export type FieldStatus = 'default' | 'error' | 'warning'

export type FieldProps = {
  label?: ReactNode
  required?: boolean
  status?: FieldStatus
  error?: ReactNode
  children?: ReactNode
}

export function Field({ label, required, status = 'default', error, children }: FieldProps) {
  return (
    <div className="sm-field" data-status={status} {...(required ? { 'data-required': 'true' } : null)}>
      {label != null ? <label className="sm-field__label">{label}</label> : null}
      <div className="sm-field__control">{children}</div>
      {error != null ? (
        <div className="sm-field__error" role="alert">
          {error}
        </div>
      ) : null}
    </div>
  )
}
