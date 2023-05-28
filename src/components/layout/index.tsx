import React from "react"
import tw from "twin.macro"

import AuthModal from "@/components/authModal"
import useStore from "@/stores/useStore"
import AsideBar from "./asideBar"
import Footer from "./footer"
import AppHeader from "./header"
import MobileAsideBar from "./mobileAsideBar"

interface props {
  children: React.ReactNode
}

export default function Layout({ children }: props) {
  const { showAsideBar } = useStore()

  return (
    <>
      <AppHeader />
      <Container>
        <AsideBar />
        <Main>{children}</Main>
      </Container>
      {/* <Footer /> */}

      <AuthModal />
      <MobileAsideBar isOpen={showAsideBar} />
    </>
  )
}

const LayoutStyled = tw.div`relative`
const Container = tw.div`w-full h-screen pt-[65px] grid grid-cols-1 md:grid-cols-[minmax(150px, 200px)_1fr] max-w-7xl mx-auto`
const Main = tw.main`h-full px-5 lg:px-10 py-10`
