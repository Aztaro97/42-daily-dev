import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import Hamburger from "hamburger-react"
import { useSession } from "next-auth/react"
import { Navbar } from "react-daisyui"
import { BsSearch } from "react-icons/bs"
import Skeleton from "react-loading-skeleton"
import tw from "twin.macro"

import CreatePostButton from "@/components/createPostButton"
import SwitchTheme from "@/components/switchTheme"
import CustomButton from "@/components/ui/customButton"
import NavUserAvatar from "@/components/userAvatar"
import { WhiteLargeLogo, WhiteLogoSVG } from "@/assets"
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
            <Image
              src={WhiteLargeLogo}
              alt="Logo"
              width={400}
              height={400}
              className="w-20 h-auto"
            />
          </Link>
        </LeftNav>
        <RightNav>
          <Link href="/search">
            <BsSearch size={22} />
          </Link>

          {status === "loading" ? (
            <Skeleton height={30} width={90} />
          ) : session ? (
            <>
              <CreatePostButton />
              <NavUserAvatar />
            </>
          ) : (
            <CustomButton
              tw="py-1"
              onClick={() => setShowModal(true)}
              variants="primary"
            >
              Login
            </CustomButton>
          )}
          <SwitchThemeStyled />
        </RightNav>
      </NavBarStyled>
    </HeaderContainer>
  )
}

const HeaderContainer = tw.header`w-full fixed top-0 flex justify-between items-center h-[65px] px-5 lg:px-10 gap-10 border-b border-gray-400 border-opacity-40 z-30 bg-slate-900`
const LeftNav = tw.div`flex-1`
const RightNav = tw.div`flex-none items-center space-x-4`
const NavBarStyled = tw(Navbar)` max-w-7xl mx-auto`
const HamburgerWrapper = tw.div`!z-50 block md:!hidden`
const SwitchThemeStyled = tw(SwitchTheme)`hidden md:block`

export default AppHeader
