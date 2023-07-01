import React from "react"
import Error from "next/error"
import Link from "next/link"

import CustomButton from "@/components/ui/customButton"

interface props {
  title: string
}

const CustomPage404 = ({ title }: props) => {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen gap-5 bg-transparent">
      <h1 className="text-5xl">{title}</h1>
      <Link href="/">
        <CustomButton>Go to Home</CustomButton>
      </Link>
    </div>
  )
}

export default CustomPage404
