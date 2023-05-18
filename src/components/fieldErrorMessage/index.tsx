import React, { FC } from "react"
import { ErrorMessage } from "@hookform/error-message"

interface props {
  children: React.ReactNode
  name: string
  errors: any
}

const FieldErrorMessage: FC<props> = ({ children, name, errors }) => {
  return (
    <div>
      {children}
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => <p className="text-red-400">{message}</p>}
      />
    </div>
  )
}

export default FieldErrorMessage
