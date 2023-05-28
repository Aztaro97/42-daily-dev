import React, { useEffect, useState } from "react"
import Link from "next/link"
import Hamburger from "hamburger-react"
import { useSession } from "next-auth/react"
import { Navbar } from "react-daisyui"
import tw from "twin.macro"

import CreatePostButton from "@/components/createPostButton"
import InputSearchField from "@/components/inputSearchField"
import SwitchTheme from "@/components/switchTheme"
import CustomButton from "@/components/ui/customButton"
import NavUserAvatar from "@/components/userAvatar"
import useStore from "@/stores/useStore"

const AppHeader = () => {
  const { showModal, setShowModal, showAsideBar, setShowAsideBar } = useStore()
  const [windowWidth, setWindowWidth] = useState<number | null>(null)
  const { data: session, status } = useSession()

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    if (window !== undefined) {
      handleResize()
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [windowWidth])

  if (status === "loading") {
    return null
  }

  return (
    <HeaderContainer>
      <NavBarStyled>
        <LeftNav>	
          <HamburgerWrapper>
            <Hamburger
              color="#ffffffaf"
              toggled={showAsideBar}
              toggle={setShowAsideBar as any}
            />
          </HamburgerWrapper>
          <Link href="/" className="hidden md:block" color="ghost">
            <h1>Logo</h1>
          </Link>
        </LeftNav>
        <RightNav>
          <InputSearchField />
          <SwitchThemeStyled />
          {session ? (
            <>
              <CreatePostButton />
              <NavUserAvatar />
            </>
          ) : (
            <CustomButton
              tw="py-1"
              onClick={() => setShowModal(true)}
              bgColor="primary"
            >
              Login
            </CustomButton>
          )}
        </RightNav>
      </NavBarStyled>
    </HeaderContainer>
  )
}

const HeaderContainer = tw.header`w-full fixed top-0 flex justify-between items-center h-[65px] px-5 lg:px-10 gap-10 border-b border-gray-400 border-opacity-40 z-30 bg-slate-900`
const LeftNav = tw.div`flex-1`
const RightNav = tw.div`flex-none items-center gap-2`
const NavBarStyled = tw(Navbar)` max-w-7xl mx-auto`
const HamburgerWrapper = tw.div`!z-50 block md:!hidden`
const SwitchThemeStyled = tw(SwitchTheme)`hidden md:block`

export default AppHeader
