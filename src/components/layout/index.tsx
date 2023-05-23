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
    <Container>
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
        tw="!h-full relative top-[65px] !overflow-y-hidden"
        contentClassName={"px-10 lg:px-20 pb-20 pt-10 overflow-y-hidden"}
        sideClassName="w-48"
      >
        <main>{children}</main>
        <AuthModal />
      </Drawer>
      {/* <Footer /> */}
    </Container>
  )
}

const Container = tw.div`w-full h-screen overflow-y-hidden`
