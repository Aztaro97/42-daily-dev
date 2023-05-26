import React, { useState } from "react"
import { Button, Drawer } from "react-daisyui"
import tw from "twin.macro"

import AuthModal from "@/components/authModal"
import AsideBar from "./asideBar"
import Footer from "./footer"
import AppHeader from "./header"
import MobileAsideBar from "./mobileAsideBar"

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
      <Container>
        <AsideBar
          toggleVisible={toggleVisible}
          isSidebarExtended={isSidebarExtended}
        />
        <Main>{children}</Main>
      </Container>
      {/* <Footer /> */}
      <AuthModal />
    </>
  )
}

const LayoutStyled = tw.div`relative`
const Container = tw.div`w-full overflow-hidden h-screen pt-[65px] grid grid-cols-1 md:grid-cols-[minmax(90px, 200px)_1fr] max-w-7xl mx-auto`
const Main = tw.main`h-full px-5 lg:px-10 py-10 overflow-x-hidden overflow-y-scroll`
