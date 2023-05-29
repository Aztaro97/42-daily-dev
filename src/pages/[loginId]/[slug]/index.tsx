import React from "react"
import { GetStaticPaths, GetStaticProps } from "next"
import Image from "next/image"
import Link from "next/link"
import styled from "@emotion/styled"
import dayjs from "dayjs"
import { Avatar } from "react-daisyui"
import { MdOutlineAccessTime } from "react-icons/md"
import ReadingTime from "reading-time"
import tw from "twin.macro"

import { api } from "@/utils/api"
import CommentField from "@/components/commentField"
import Layout from "@/components/layout"
import MdRendering from "@/components/mdRendering"
import ShareButton from "@/components/shareButton"
import { DefaultProfileImg } from "@/assets"
import { generateSSGHelper } from "@/server/helpers/ssgHelper"

export default function PostPage({ slug }: { slug: string }) {
  const { data, isLoading } = api.blog.getPostBySlug.useQuery(
    { slug },
    {
      enabled: !!slug,
    },
  )

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
                  src={data?.author?.image ?? DefaultProfileImg.src}
                  shape="circle"
                  size="xs"
                  border={true}
                />
                <div>
                  <span tw="text-white">{data?.author?.name}</span>
                  <PostDate>
                    Posted on {dayjs(data?.createdAt).format("MMMM DD, YYYY")}
                  </PostDate>
                </div>
              </AuthorLink>
              {/*  */}
              <ReadingTimeStyled>
                <MdOutlineAccessTime tw="text-secondary" size={30} />
                <span>{ReadingTime(data?.content as string).text}</span>
              </ReadingTimeStyled>
            </Box>
          </BannerWrapper>

          <BodyWraper>
            <MdRendering data={data?.content} />
          </BodyWraper>
          <FlexWrapper>
            <TagStyled>
              <span className="tag_title">Tag:</span>
              {data?.tags.map((tag) => (
                <span className="tag">{`#${tag.name}`}</span>
              ))}
            </TagStyled>
            <ShareButton />
          </FlexWrapper>
          <CommentField postId={data?.id as string} />
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

const Grid = tw.div`grid grid-cols-1 lg:grid-cols-[minmax(180px, 1fr)_200px] gap-10`
const PostWrapper = tw.div`w-full`
const PostDate = tw.p`text-xs text-gray-400`
const PostTitle = tw.h1`text-4xl text-white my-8`
const BannerWrapper = tw.div`mb-10`
const BannerImage = tw(Image)`w-full h-[400px] object-cover object-center mb-4`
const BodyWraper = tw.div`mb-10 text-gray-400 w-full mx-0 prose lg:prose-lg`
const AuthorLink = tw(Link)`flex items-center gap-3`
const Box = tw.div`flex justify-between gap-x-5 mb-4`
const FlexWrapper = tw.div`flex flex-col gap-5 mb-14`
const TagStyled = styled.p`
  ${tw`text-lg text-white flex-wrap break-words`}
  & .tag_title {
	${tw`mr-1 font-medium`}
  }
  & .tag {
    ${tw`mx-1 border-b border-secondary text-secondary`}
  }
`
const RightElement = tw.div``
const ReadingTimeStyled = tw.div`flex items-center gap-1 text-sm`
