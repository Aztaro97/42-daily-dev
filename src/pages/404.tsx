import React from "react"
import Error from "next/error"

interface props {
  title: string
}

const CustomPage404 = ({ title }: props) => {
  return (
      <Error title={title} statusCode={404} tw="bg-transparent" />
  )
}

export default CustomPage404
