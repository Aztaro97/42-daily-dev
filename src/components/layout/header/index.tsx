import React, { useEffect, useState } from "react"
import Link from "next/link"
import Hamburger from "hamburger-react"
import { useSession } from "next-auth/react"
import { Button, Dropdown, Form, Input, Navbar } from "react-daisyui"
import tw from "twin.macro"

import CreatePostButton from "@/components/createPostButton"
import InputSearchField from "@/components/inputSearchField"
import SwitchTheme from "@/components/switchTheme"
import CustomButton from "@/components/ui/customButton"
import NavUserAvatar from "@/components/userAvatar"
import useStore from "@/stores/useStore"
import MobileAsideBar from "../mobileAsideBar"

const AppHeader = () => {
  const { showModal, setShowModal } = useStore()
  const [isOpen, setOpen] = useState<boolean>(false)
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
    <>
      <HeaderContainer>
        <NavBarStyled>
          <div className="flex-1">
            <div className="z-50">
              {windowWidth! < 786 && (
                <HamburgerStyled
                  color="#fff"
                  toggled={isOpen}
                  toggle={setOpen}
                />
              )}
            </div>
            <Link href="/" className="text-xl normal-case" color="ghost">
              <h1>Logo</h1>
            </Link>
          </div>
          <RightNav>
            <InputSearchField />
            {windowWidth! > 786 && <SwitchTheme />}
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
      <MobileAsideBar isOpen={isOpen} />
    </>
  )
}

const HeaderContainer = tw.header`w-full absolute top-0 flex justify-between items-center h-[65px] px-5 lg:px-10 gap-10 border-b border-gray-400 border-opacity-40 z-30 bg-slate-900`
const RightNav = tw.div`flex-none items-center gap-2`
const NavBarStyled = tw(Navbar)` max-w-7xl mx-auto`
const HamburgerStyled = tw(Hamburger)`!z-50 relative`

export default AppHeader
