import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import styled from "@emotion/styled"
import dayjs from "dayjs"
import { Button, Card, Tooltip } from "react-daisyui"
import { AiOutlineLike, AiTwotoneLike } from "react-icons/ai"
import { BiCommentDots } from "react-icons/bi"
import { GrView } from "react-icons/gr"
import tw from "twin.macro"
import { z } from "zod"

import { api } from "@/utils/api"
import { IPost } from "@/@types/types"

function PostCard({
  id,
  title,
  image,
  slug,
  author,
  _count,
  createdAt,
  likes,
}: IPost) {
  const [isLike, setIsLike] = useState<boolean>(false)

  const createLike = api.like.createLike.useMutation({
    onSuccess: () => {
      console.log("like success")
      //   setIsLike(!isLike)
    },
  })

  const onLikePost = async (dislike: boolean) => {
    await createLike.mutateAsync({
      postId: id,
      dislike,
    })
  }

  return (
    <Link href={`/${author.login}/${slug}`}>
      <CardWrapper>
        <Card.Image src={image} tw="h-48 w-full object-cover" alt="Post" />
        <CardBody>
          <CardDate>{dayjs(createdAt).format("MMM D, YYYY")}</CardDate>
          <CardTitle tag="h2">{title}</CardTitle>
          <CardActions>
            <CardAvatar
              src={author.image?.link ?? ""}
              height={60}
              width={60}
              alt="user avatar"
            />
            <CardRightAction>
              <Tooltip color="primary" message="View">
                <CardActionIcon>
                  <GrView size={20} tw="!stroke-gray-400" />
                  <span>{_count?.views}</span>
                </CardActionIcon>
              </Tooltip>
              <Tooltip color="primary" message="Comment">
                <CardActionIcon tw="border-x border-gray-400 border-opacity-40 px-3">
                  <BiCommentDots size={20} />
                  <span>{_count?.comments}</span>
                </CardActionIcon>
              </Tooltip>
              <Tooltip color="primary" message="Like">
                <CardActionIcon>
                  {likes.length ? (
                    <AiTwotoneLike
                      onClick={() => onLikePost(false)}
                      tw="text-primary"
                      size={20}
                    />
                  ) : (
                    <AiOutlineLike onClick={() => onLikePost(true)} size={20} />
                  )}
                  <span>{_count.likes}</span>
                </CardActionIcon>
              </Tooltip>
            </CardRightAction>
          </CardActions>
        </CardBody>
      </CardWrapper>
    </Link>
  )
}

const CardWrapper = tw(
  Card,
)`border border-gray-700 hover:border-primary transition duration-500 ease-in-out cursor-pointer`
const CardTitle = tw(Card.Title)`line-clamp-3 text-white text-2xl mb-0`
const CardBody = tw(Card.Body)`px-6 pt-2`
const CardDate = tw.p`text-gray-400 text-opacity-80 text-xs`
const CardActions = tw(
  Card.Actions,
)`flex justify-between items-center gap-3 mt-4`
const CardAvatar = tw(Image)`rounded-full w-8 h-8`
const CardRightAction = tw.div`flex gap-2`
const CardActionIcon = styled.div`
  ${tw`flex items-center gap-1 px-1 text-gray-400`}

  & span {
    ${tw`text-sm text-gray-400`}
  }
`

export default PostCard
