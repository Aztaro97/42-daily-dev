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
      <MainContainer>
        <AsideBar />
        <BodySection>{children}</BodySection>
      </MainContainer>
      {/* <Footer /> */}

      <AuthModal />
      <MobileAsideBar isOpen={showAsideBar} />
    </>
  )
}

const MainContainer = tw.main`w-full h-screen pt-[65px] grid grid-cols-1 md:grid-cols-[minmax(150px, 200px)_1fr] max-w-7xl mx-auto`
const BodySection = tw.section`h-full px-5 lg:px-10 py-10`
