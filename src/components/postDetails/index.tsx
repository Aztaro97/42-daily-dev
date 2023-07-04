import React, { FC, useCallback, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import styled from "@emotion/styled"
import dayjs from "dayjs"
import { Avatar, Divider } from "react-daisyui"
import { MdOutlineAccessTime } from "react-icons/md"
import Skeleton from "react-loading-skeleton"
import ReadingTime from "reading-time"
import tw from "twin.macro"

import CommentField from "@/components/commentField"
import MdRendering from "@/components/mdRendering"
import ShareButton from "@/components/shareButton"
import { IPost } from "@/@types/types"
import { DefaultPostImg, DefaultProfileImg } from "@/assets"
import PostAction from "./postAction"

interface props {
  data: IPost | any
}

export default function PostDetails({ data }: props) {
  return (
    <PostWrapper>
      <BannerWrapper>
        <BannerImage
          src={(data?.image ?? DefaultPostImg.src) as string}
          width={900}
          height={400}
          alt={data?.title as string}
          priority
        />
        <PostTitle>{data?.title}</PostTitle>
        <Box>
          <AuthorLink href={`/${data?.author?.login}`}>
            <Avatar
              src={(data?.author?.image ?? DefaultProfileImg.src) as string}
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

      <Divider className="m-0" />
      <div className="flex items-center justify-between">
        <PostAction data={data} />
        <ShareButton />
      </div>
      <Divider className="m-0" />
      <BodyWraper>
        <MdRendering data={data?.content} />
      </BodyWraper>
      <FlexWrapper>
        <TagStyled>
          <span className="tag_title">Tag:</span>
          {data?.tags.map((tag: any) => (
            <span className="tag">{`#${tag.name}`}</span>
          ))}
        </TagStyled>
      </FlexWrapper>
      <CommentField postId={data?.id as string} />
    </PostWrapper>
  )
}

PostDetails.Skeleton = function PostDetailsSkeleton() {
  return (
    <PostWrapper>
      <BannerWrapper>
        <Skeleton className="w-full mb-5" height={400} />
        <Skeleton height={17} count={2} className="w-full" />
        <Box className="mt-5">
          <AuthorLink href={`/#`}>
            <Skeleton circle={true} height={40} width={40} />
            <div>
              <Skeleton height={6} width={100} />
              <PostDate>
                <Skeleton height={4} width={100} />
              </PostDate>
            </div>
          </AuthorLink>
          {/*  */}
          <ReadingTimeStyled>
            <Skeleton circle={true} height={40} width={40} />
            <Skeleton height={10} width={50} />
          </ReadingTimeStyled>
        </Box>
      </BannerWrapper>

      <BodyWraper>
        <Skeleton count={7} height={10} className="w-full" />
      </BodyWraper>
      <FlexWrapper>
        <TagStyled>
          <Skeleton height={10} width={50} />
        </TagStyled>
      </FlexWrapper>
    </PostWrapper>
  )
}

const PostWrapper = tw.div`w-full`
const PostDate = tw.p`text-xs text-gray-400`
const PostTitle = tw.h1`text-4xl text-white my-8`
const BannerWrapper = tw.div`mb-4`
const BannerImage = tw(Image)`w-full h-[400px] object-cover object-center mb-4`
const BodyWraper = tw.div`mb-10 mt-5 text-gray-400 w-full mx-0 prose lg:prose-lg`
const AuthorLink = tw(Link)`flex items-center gap-3`
const Box = tw.div`flex justify-between gap-x-5 mb-4`
const FlexWrapper = tw.div`flex flex-col gap-5 mb-14`
const TagStyled = styled.p`
  ${tw`flex-wrap text-lg text-white break-words`}
  & .tag_title {
    ${tw`mr-1 font-medium`}
  }
  & .tag {
    ${tw`mx-1 border-b border-secondary text-secondary`}
  }
`
const ReadingTimeStyled = tw.div`flex items-center gap-1 text-sm`
