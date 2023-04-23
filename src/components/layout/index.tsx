import React, { useState } from "react"
import { Button, Drawer } from "react-daisyui"
import tw from "twin.macro"

import AuthModal from "@/components/authModal"
import AsideBar from "./asideBar"
import Footer from "./footer"
import AppHeader from "./header"

interface props {
  children: React.ReactNode
}

export default function Layout({ children }: props) {
  const [isSidebarExtended, setSidebarExtended] = useState(false)
  const [visible, setVisible] = useState(true)
  const toggleVisible = () => {
    setVisible(!visible)
  }
  return (
    <>
      <AppHeader />
      <Drawer
        side={
          <AsideBar
            toggleVisible={toggleVisible}
            isSidebarExtended={isSidebarExtended}
          />
        }
        open={visible}
        mobile={visible}
        onClickOverlay={toggleVisible}
        tw="!h-[100vh - 65px]"
        contentClassName={"py-5 px-20 relative top-[65px] mb-20 mt-10"}
        sideClassName="w-48 relative top-[65px]"
      >
        <main>{children}</main>
      </Drawer>
      {/* <Footer /> */}
      <AuthModal />
    </>
  )
}

const Container = tw.div`w-full`
