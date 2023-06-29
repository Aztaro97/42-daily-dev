import React, { useEffect } from "react"
import { useRouter } from "next/router"
import { signIn, signOut, useSession } from "next-auth/react"
import tw from "twin.macro"

import CustomButton from "@/components/ui/customButton"

export default function LoginPage() {
  const router = useRouter()
  const { data: session } = useSession()

  const callbackUrl = decodeURI((router.query?.callbackUrl as string) ?? "/")

  const handleLogin = async () => {
    await signIn("42-school", {
      redirect: true,
      callbackUrl,
    })
  }

  useEffect(() => {
    if (session) {
      router.push(callbackUrl)
    }
  }, [session, router, callbackUrl])

  return (
    <Container>
      {session ? (
        <>
          Sign in as {session?.user?.email} <br />
          <CustomButton variants="primary" onClick={() => signOut()}>
            Sign out
          </CustomButton>
        </>
      ) : (
        <>
          <h1 className="text-2xl mb-3">Not signed in</h1>
          <CustomButton variants="primary" onClick={handleLogin}>
            Click to Sign in
          </CustomButton>
        </>
      )}
    </Container>
  )
}

const Container = tw.div`min-h-screen w-full flex flex-col items-center justify-center `
