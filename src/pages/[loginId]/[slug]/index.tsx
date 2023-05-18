import React from "react"
import { GetStaticPaths, GetStaticProps } from "next"
import Image from "next/image"
import Link from "next/link"
import styled from "@emotion/styled"
import dayjs from "dayjs"
import { Avatar } from "react-daisyui"
import tw from "twin.macro"

import { api } from "@/utils/api"
import BlockEditorRendering from "@/components/EditorRendering"
import CommentField from "@/components/commentField"
import Layout from "@/components/layout"
import ShareButton from "@/components/shareButton"
import { generateSSGHelper } from "@/server/helpers/ssgHelper"

export default function PostPage({ slug }: { slug: string }) {
  const {
    data,
    isLoading,
  } = api.blog.getPostBySlug.useQuery({ slug })

  if (data && !isLoading) {
    console.log("Post Detail", data)
  }

  if (isLoading) {
    return (
      <Layout>
        <h2>Loading...</h2>
      </Layout>
    )
  }

  return (
    <Layout>
      <Grid>
        <PostWrapper>
          <BannerWrapper>
            <BannerImage
              src={data?.image as string}
              width={900}
              height={400}
              alt={data?.title as string}
            />
            <PostTitle>{data?.title}</PostTitle>
            <Box>
              <AuthorLink href={`/${data?.author?.login}`}>
                <Avatar
                  src={data?.author?.image as string}
                  shape="circle"
                  size="xs"
                  border={true}
                />
                <span tw="text-gray-400">{data?.author?.name}</span>
              </AuthorLink>
              <PostDate>
                Published: {dayjs(data?.createdAt).format("MMMM DD, YYYY")}
              </PostDate>
            </Box>
          </BannerWrapper>
          <BodyWraper>
            <BlockEditorRendering data={data?.content} />
          </BodyWraper>
          <FlexWrapper>
            <TagStyled>
              Tag:{" "}
              {data?.tags.map((tag) => (
                <span>{`#${tag.name}`}</span>
              ))}
            </TagStyled>
            <ShareButton />
          </FlexWrapper>
          <CommentField
            commentData={data?.comments}
            postId={data?.id}
          />
        </PostWrapper>
        <RightElement>Related Post</RightElement>
      </Grid>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  }
}
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const ssg = generateSSGHelper()

  const slug = params?.slug as string

  if (typeof slug !== "string") throw new Error("The slug should be a string")

  await ssg.blog.getPostBySlug.prefetch({ slug })

  return {
    props: {
      trpcState: ssg.dehydrate(),
      slug,
    },
  }
}

const Grid = tw.div`grid grid-cols-1 lg:grid-cols-[minmax(180px, 1fr)_180px] 2xl:grid-cols-[minmax(300px, 1fr)_450px] gap-10`
const PostWrapper = tw.div`w-full`
const PostDate = tw.p`text-sm text-gray-400`
const PostTitle = tw.h1`text-4xl text-white my-5`
const BannerWrapper = tw.div``
const BannerImage = tw(Image)`w-full h-[400px] object-cover object-center mb-4`
const BodyWraper = tw.div`mb-4 text-gray-400 w-full mx-0 prose lg:prose-lg`
const AuthorLink = tw(Link)`flex items-center gap-3`
const Box = tw.div`flex justify-between gap-x-5 mb-4`
const FlexWrapper = tw.div`flex items-center justify-between gap-5`
const TagStyled = styled.p`
  ${tw`text-lg text-white`}
  & span {
    ${tw`mx-1 border-b border-secondary text-secondary`}
  }
`
const RightElement = tw.div``
