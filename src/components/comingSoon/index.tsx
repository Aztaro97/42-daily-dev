import React from "react"
import { useRouter } from "next/router"
import tw from "twin.macro"

import CustomButton from "../ui/customButton"

const ComingSoon = () => {
  const router = useRouter()
  return (
    <Container>
      <Title>Coming Soon.</Title>
      <SubTitle>Stay tuned, we're going to lunch the PodCast very soon</SubTitle>
      <CustomButton onClick={() => router.back()}>Go Back</CustomButton>
    </Container>
  )
}

const Container = tw.div`p-10 w-full flex justify-center items-center flex-col gap-5`
const Title = tw.h1`text-7xl text-primary font-bold uppercase`
const SubTitle = tw.h1`text-lg`

export default ComingSoon
