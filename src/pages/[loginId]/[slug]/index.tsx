import React from "react"
import Image from "next/image"
import Link from "next/link"
import styled from "@emotion/styled"
import { Avatar } from "react-daisyui"
import tw from "twin.macro"

import Layout from "@/components/layout"
import ShareButton from "@/components/shareButton"

const PostPage = () => {
  return (
    <Layout>
      <Grid>
        <PostWraper>
          <BannerWrapper>
            <BannerImage
              src="https://daily-now-res.cloudinary.com/image/upload/v1679306271/96835229db75693a44e598609fe73bbb.jpg"
              width={900}
              height={400}
              alt="Post Image"
            />
            <PostTitle>How to Create Dynamic Routes in Next.js</PostTitle>
            <Box>
              <AuthorLink href="/ataro-ga">
                <Avatar
                  src="https://i.pravatar.cc/300"
                  shape="circle"
                  size="xs"
                  border={true}
                />
                <span>Mohammed</span>
              </AuthorLink>
              <PostDate>Published: April 13, 2023</PostDate>
            </Box>
          </BannerWrapper>
          <BodyWraper>
            Lorem ipsum dolor sit amet consectetur adipiscing elit id conubia,
            non porttitor nisl quam ac iaculis bibendum consequat, rhoncus vel
            varius cum sapien urna sociis penatibus. Id fermentum orci nullam
            cum vehicula cursus lectus turpis, senectus aliquam curae iaculis
            pellentesque a vivamus cubilia, interdum elementum ultrices
            convallis purus dapibus dis. Leo mi purus sagittis proin lobortis
            mollis malesuada fames auctor platea, venenatis nisi euismod eros
            potenti eleifend imperdiet nam lectus, donec pulvinar class felis
            elementum per condimentum sociosqu integer. Parturient nascetur sem
            porttitor facilisi accumsan convallis sagittis, mauris proin iaculis
            fringilla felis varius hac, fusce tempus pharetra tincidunt urna
            quis. Turpis dui cursus curae sollicitudin sociis arcu faucibus
            ullamcorper massa, eu elementum nisi inceptos quisque urna facilisis
            lectus eleifend, nascetur auctor tincidunt platea lacus placerat
            laoreet velit. Venenatis maecenas justo leo mollis velit
            sollicitudin ridiculus nullam, posuere bibendum mauris egestas nulla
            malesuada integer, ullamcorper magnis duis mus scelerisque lacus
            nisl. Senectus facilisi donec magnis quisque vitae hendrerit
            suscipit elementum, vulputate purus nullam quis pretium phasellus
            sapien, neque tempor sed pulvinar fringilla torquent facilisis.
            Mauris torquent sociosqu duis enim aptent et pulvinar auctor
            facilisi, aenean porta eros mus pretium proin volutpat ridiculus,
            sollicitudin class tellus habitasse a ultrices lectus sed. Pulvinar
            tristique torquent lacinia quisque ornare nisi sed mus, habitant
            penatibus proin fringilla purus scelerisque convallis himenaeos,
            ante felis lacus vulputate eu venenatis tempus. Natoque ullamcorper
            ad nunc arcu scelerisque himenaeos posuere ac ultrices fusce,
            malesuada accumsan class per hendrerit suspendisse suscipit dui leo
            luctus massa, mattis blandit curabitur mauris ultricies venenatis
            viverra dignissim nisl.
          </BodyWraper>
          <FlexWrapper>
            <TagStyled>
              Tag: <span>#Libft</span>, <span>#FT_Container</span>,{" "}
              <span>#Born2BeRoot</span>{" "}
            </TagStyled>
            <ShareButton />
          </FlexWrapper>
        </PostWraper>
        <RightElement>Related Post</RightElement>
      </Grid>
    </Layout>
  )
}

const Grid = tw.div`grid grid-cols-1 lg:grid-cols-[minmax(180px, 1fr)_180px] 2xl:grid-cols-[minmax(300px, 1fr)_450px] gap-10`
const PostWraper = tw.div`w-full`
const PostDate = tw.p`text-sm text-gray-400`
const PostTitle = tw.h1`text-4xl text-white mb-4`
const BannerWrapper = tw.div``
const BannerImage = tw(Image)`w-full h-[400px] object-cover object-center mb-4`
const BodyWraper = tw.div`mb-4`
const AuthorLink = tw(Link)`flex items-center gap-2`
const Box = tw.div`flex justify-between gap-x-5 mb-4`
const FlexWrapper = tw.div`flex items-center justify-between gap-5`
const TagStyled = styled.p`
  ${tw`text-lg`}
  & span {
    ${tw`border-b border-primary`}
  }
`
const RightElement = tw.div``

export default PostPage
