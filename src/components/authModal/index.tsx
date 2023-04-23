import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { signIn, useSession } from "next-auth/react"
import { Button, Modal } from "react-daisyui"
import { VscChromeClose } from "react-icons/vsc"
import tw from "twin.macro"

import useStore from "@/stores/useStore"

export default function AuthModal() {
  const [loading, setIsLoading] = useState<boolean>(false)
  const { showModal, toggleModal } = useStore()
  const router = useRouter();
  const { data: session, status } = useSession()

  const callbackUrl = decodeURI((router.query?.callbackUrl as string) ?? "/")

  const handleLogin = async () => {
    setIsLoading(true)
    await signIn("42-school", {
      redirect: true,
      callbackUrl,
    })
  }

  useEffect(() => {
    if (session) {
      setIsLoading(false)
    }
  }, [loading])

  return (
    <Modal open={showModal} onClickBackdrop={toggleModal}>
      <Modal.Header className="flex items-center justify-between">
        <SubTitle>Welcome to 42 Daily Dev</SubTitle>
        <CloseButton onClick={toggleModal}>
          <VscChromeClose tw="text-gray-400" size={25} />
        </CloseButton>
      </Modal.Header>

      <Modal.Body>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Enim, odit
        sit, eligendi quibusdam veritatis assumenda molestiae ea officia magnam
        nulla at magni natus asperiores dignissimos. Laborum sequi nihil maxime
        officiis?
      </Modal.Body>

      <Modal.Actions>
        <LoginButton onClick={handleLogin} loading={loading}>
          Login with your 42 intra
        </LoginButton>
      </Modal.Actions>
    </Modal>
  )
}

const SubTitle = tw.h3`text-gray-400 text-2xl font-bold`
const CloseButton = tw(Button)`w-12 h-12 rounded-full px-1`
const LoginButton = tw(Button)`w-full bg-primary`
