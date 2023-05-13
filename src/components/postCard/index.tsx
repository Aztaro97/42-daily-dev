import { truncate } from "fs"
import React, { memo, useCallback, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import styled from "@emotion/styled"
import dayjs from "dayjs"
import { useSession } from "next-auth/react"
import { Button, Card, Tooltip } from "react-daisyui"
import {
  AiFillLike,
  AiOutlineDislike,
  AiOutlineLike,
  AiTwotoneLike,
} from "react-icons/ai"
import { BiCommentDots } from "react-icons/bi"
import { GrView } from "react-icons/gr"
import { RiHeart2Fill, RiHeart2Line } from "react-icons/ri"
import tw from "twin.macro"
import { z } from "zod"

import { api } from "@/utils/api"
import { IPost } from "@/@types/types"
import useStore from "@/stores/useStore"
import { errorAlert } from "../alert"

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
  const [likeByMe, setLikeByMe] = useState<boolean>(false)
  const { data: userSession } = useSession()
  const { showModal, setShowModal } = useStore()

  const tRpcUtils = api.useContext()

  const { data } = api.blog.getPostBySlug.useQuery({ slug })

  const toggleLike = api.like.toggleLike.useMutation({
    onMutate: async ({ dislike, postId }) => {
      const dislikeCount = dislike ? 1 : -1

      await tRpcUtils.blog.getAllPosts.cancel()
      await tRpcUtils.blog.getPostBySlug.cancel()

      const previousPost = tRpcUtils.blog.getPostBySlug.getData({ slug })

      //   Update Like Count from list all post
      const previousAllPost = tRpcUtils.blog.getAllPosts.getInfiniteData({
        limit: 8,
        published: true,
      })

      tRpcUtils.blog.getAllPosts.setInfiniteData(
        { limit: 8, published: true },
        (oldData: any) => {
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => {
              return {
                ...page,
                posts: page.posts.map((post: any) => {
                  if (post.id === postId) {
                    return {
                      ...post,
                      //   Check if likes exist, otherwise return new object with dislike and userID
                      likes: !post.likes.length
                        ? post.likes.concat({
                            dislike: dislike,
                            userId: userSession?.userId,
                          })
                        : post.likes.map((like: any) => {
                            if (like.userId === userSession?.userId) {
                              return {
                                ...like,
                                dislike: dislike,
                                userId: like.userId,
                              }
                            }
                            return like
                          }),
                      _count: {
                        ...post._count,
                        likes: post._count.likes + dislikeCount,
                      },
                    }
                  }
                  return post
                }),
              }
            }),
          }
        },
      )

      return {
        previousPost,
        previousAllPost,
      }
    },

    // If the mutate fails
    // We'll use the context to returned from onMutate to roll back
    onError: (error, newData, context) => {
      console.log(error)
      tRpcUtils.blog.getPostBySlug.setData(
        { slug },
        { ...(context?.previousPost as any) },
      )
      tRpcUtils.blog.getAllPosts.setInfiniteData(
        { limit: 8, published: true },
        { ...(context?.previousAllPost as any) },
      )
    },

    // Alway Refresh after success or error
    onSettled: () => {
      //   console.log("like settled")
      tRpcUtils.blog.getPostBySlug.invalidate({ slug })
    },

    onSuccess: (data) => {
      console.log("like success")
      //   console.log("data", data)
    },
  })

  const onLikeOrDislikePost = useCallback(
    async (dislike: boolean) => {
      if (!userSession) {
        errorAlert("You should login")
        setShowModal(true)
        return
      }
      await toggleLike.mutateAsync({
        postId: id,
        dislike,
      })
    },
    [toggleLike, id, userSession, setShowModal],
  )

  //   const likeBy = !!likes.find(
  //       (like) => like.userId == userSession?.userId && like.dislike,
  //     ) || false

  useEffect(() => {
    // Check if the user have liked a post
    // Set False by default if any post liked
    const liked =
      !!likes.find(
        (like) => like.userId == userSession?.userId && like.dislike,
      ) || false
    setLikeByMe(liked)
  }, [likeByMe, likes, userSession])

  return (
    <CardWrapper>
      <Link href={`/${author.login}/${slug}`}>
        <Card.Image src={image} tw="h-48 w-full object-cover" alt="Post" />
        {/* <CardImage src={image} width={300} height={300} tw="h-48 w-full object-cover" alt="Post" /> */}
        <CardBody>
          <CardDate>{dayjs(createdAt).format("MMM D, YYYY")}</CardDate>
          <CardTitle tag="h2">{title}</CardTitle>
        </CardBody>
      </Link>
      <CardActions>
        <Link href={`/${author.login}`}>
          <CardAvatar
            src={author.image?.link ?? ""}
            height={60}
            width={60}
            alt="user avatar"
          />
        </Link>
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
              {likeByMe ? (
                <RiHeart2Fill
                  onClick={() => onLikeOrDislikePost(false)}
                  tw="text-primary"
                  size={20}
                />
              ) : (
                <RiHeart2Line
                  onClick={() => onLikeOrDislikePost(true)}
                  size={20}
                />
              )}

              <span>{_count.likes}</span>
            </CardActionIcon>
          </Tooltip>
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
const CardAvatar = tw(Image)`rounded-full w-8 h-8`
const CardRightAction = tw.div`flex gap-2`
const CardActionIcon = styled.div`
  ${tw`flex items-center gap-1 px-1 text-gray-400`}

  & span {
    ${tw`text-sm text-gray-400`}
  }
`
const CardImage = tw(Image)``

export default PostCard
