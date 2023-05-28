import React from "react"
import tw from "twin.macro"

import NavMenu from "@/components/navMenu"

export default function AsideBar() {
  return (
    <AsideContainer>
      <NavMenu />
    </AsideContainer>
  )
}

const AsideContainer = tw.aside`border-r border-gray-400 border-opacity-40 px-3 py-5 bg-slate-900 hidden md:block sticky`
