import React from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button, Dropdown, Form, Input, Navbar } from "react-daisyui"
import tw from "twin.macro"

import SwitchTheme from "@/components/switchTheme"
import CustomButton from "@/components/ui/customButton"
import NavUserAvatar from "@/components/userAvatar"
import useStore from "@/stores/useStore"

const AppHeader = () => {
  const { showModal, setShowModal } = useStore()
  const { data: session, status } = useSession()

  if (status === "loading") {
    return null
  }

  return (
    <HeaderContainer>
      <Navbar>
        <div className="flex-1">
          <Link href="/" className="text-xl normal-case" color="ghost">
            <h1>Logo</h1>
          </Link>
        </div>
        <RightNav>
          <Form>
            <Input bordered tw="h-[40px]" type="text" placeholder="Search" />
          </Form>
          <SwitchTheme />
          {session ? (
            <>
              <Link href="/post/create">
                <CustomButton>Create Post</CustomButton>
              </Link>
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
      </Navbar>
    </HeaderContainer>
  )
}

const HeaderContainer = tw.header`w-full top-0 flex justify-between items-center h-[65px] px-20 gap-10 border-b border-gray-400 border-opacity-40 z-30`
const RightNav = tw.div`flex-none items-center gap-2`

export default AppHeader
