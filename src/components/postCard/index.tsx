import React from "react"
import Image from "next/image"
import Link from "next/link"
import dayjs from "dayjs"
import { Card } from "react-daisyui"
import Skeleton from "react-loading-skeleton"
import tw from "twin.macro"

import { IPost } from "@/@types/types"
import { DefaultPostImg, DefaultProfileImg } from "@/assets"
import PostCardAction from "./postCardAction"

export default function PostCard({
  id,
  title,
  image,
  slug,
  author,
  _count,
  createdAt,
  likes,
}: IPost) {
  return (
    <CardWrapper>
      <Link
        href={`/${author.login}/${slug}`}
        tw="rounded-ss-2xl rounded-se-2xl overflow-hidden"
      >
        <Card.Image
          src={image ?? DefaultPostImg.src}
          tw="h-48 w-full object-cover"
          alt="Post"
        />
        <CardBody>
          <CardDate>{dayjs(createdAt).format("MMM D, YYYY")}</CardDate>
          <CardTitle tag="h2">{title}</CardTitle>
        </CardBody>
      </Link>
      <CardActions>
        <Link href={`/${author.login}`}>
          <CardAvatar
            src={author.image ?? DefaultProfileImg.src}
            height={60}
            width={60}
            alt="user avatar"
          />
        </Link>
        <PostCardAction id={id} _count={_count} likes={likes} />
      </CardActions>
    </CardWrapper>
  )
}

PostCard.Skeleton = function PostCardSkeleton() {
  return (
    <CardWrapper>
      <Skeleton tw="h-48 w-full" className="relative bottom-1 !rounded-t-2xl" />
      <CardBody>
        <Skeleton height={10} width={50} />
        <Skeleton count={2} />
      </CardBody>
      <CardActions>
        <Skeleton circle={true} height={40} width={40} />
        <CardRightAction>
          <Skeleton height={20} width={50} />
          <Skeleton height={20} width={50} />
          <Skeleton height={20} width={50} />
        </CardRightAction>
      </CardActions>
    </CardWrapper>
  )
}

const CardWrapper = tw(
  Card,
)`border relative pb-14 h-full min-h-max border-gray-700 hover:border-primary transition duration-500 ease-in-out cursor-pointer`
const CardTitle = tw(Card.Title)`line-clamp-3 text-white text-2xl mb-auto`
const CardBody = tw(Card.Body)`px-6 pt-2`
const CardDate = tw.p`text-gray-400 text-opacity-80 text-xs mt-2`
const CardActions = tw(
  Card.Actions,
)`absolute bottom-6 px-6 w-full flex justify-between items-center gap-3 mt-4`
const CardAvatar = tw(Image)`rounded-full w-8 h-8 object-cover`
const CardRightAction = tw.div`flex gap-2`
