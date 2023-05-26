import React from "react"
import tw from "twin.macro"

import NavMenu from "@/components/navMenu"

interface props {
  isSidebarExtended: boolean
  toggleVisible: () => void
}

export default function AsideBar({ isSidebarExtended, toggleVisible }: props) {
  return (
    <AsideContainer
    // 	className={`bg-gray-800 text-white w-56 flex-shrink-0 h-full overflow-y-auto ${
    // 	isSidebarExtended ? "w-64" : "w-16"
    //   } sm:w-16 md:w-56 lg:w-64 xl:w-64 2xl:w-64`}
    >
      <NavMenu />
	  <h1>Hello</h1>
    </AsideContainer>
  )
}

const AsideContainer = tw.aside`border-r border-gray-400 border-opacity-40 px-3 py-5 bg-slate-900 hidden lg:block `
