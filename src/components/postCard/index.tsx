import React, { memo, useCallback, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import styled from "@emotion/styled"
import dayjs from "dayjs"
import { useSession } from "next-auth/react"
import { Button, Card, Tooltip } from "react-daisyui"
import { AiOutlineLike, AiTwotoneLike } from "react-icons/ai"
import { BiCommentDots } from "react-icons/bi"
import { GrView } from "react-icons/gr"
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
  const [isLike, setIsLike] = useState<boolean>(false)
  const { data: userSession } = useSession()
  const { showModal, setShowModal } = useStore()

  const utils = api.useContext()

  const { data } = api.blog.getPostBySlug.useQuery({ slug })

  const createLike = api.like.createLike.useMutation({
    onMutate: async ({ dislike, postId }) => {
      console.log("Mutate dislike :", dislike)
      console.log("Mutate postId :", postId)

      await utils.blog.getAllPosts.cancel()
      await utils.blog.getPostBySlug.cancel()

      const previousPost = utils.blog.getPostBySlug.getData({ slug })

      console.log("previousPost", previousPost)

      //   //   Update Actual Like Query
      //   const previousLikes = utils.like.getLikesByPostId(postId)
      //   console.log("previousLikes :", previousLikes)

      //   //   Optimistic Update
      //   utils.like.setLikesByPostId(postId, {
      //     ...previousLikes,
      //     likes: [
      //       ...previousLikes.likes,
      //       {
      //         id: "optimistic",
      //         dislike,
      //         createdAt: new Date().toISOString(),
      //         updatedAt: new Date().toISOString(),
      //         userId: "optimistic",
      //         postId,
      //       },
      //     ],
      //   })

      // Update Like Count from Sing Post
      if (previousPost) {
        utils.blog.getPostBySlug.setData(
          { slug },
          {
            ...previousPost,
            _count: {
              ...previousPost._count,
              likes: previousPost._count.likes + 1,
            },
          },
        )
      }

      //   Update Like Count from list all post
      const previousAllPost = utils.blog.getAllPosts.getInfiniteData({
        limit: 8,
        published: true,
      })
      console.log("previousAllPost--", previousAllPost)

      utils.blog.getAllPosts.setInfiniteData(
        { limit: 8, published: true },
        (data: any) => {
          return {
            ...data,
            pages: data.pages.map((page: any) => {
              return {
                ...page,
                posts: page.posts.map((post: any) => {
                  if (post.id === postId) {
                    return {
                      ...post,
                      dislike: dislike,
                      _count: {
                        ...post._count,
                        likes: post._count.likes + 1,
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

      return () => {
        // // Revert Like Query
        // utils.like.setLikesByPostId(postId, previousLikes),
        //   // Revert Post Query
        //   utils.blog.setPostBySlug(slug, previousPost),
        previousPost
      }
    },

    // If the mutate fails
    // We'll use the context to returned from onMutate to roll back
    onError: (error, newData, context) => {
      console.log(error)
      utils.blog.getPostBySlug.setData({ slug }, { ...context?.previousPost })
    },

    // Alway Refresh after success or error
    onSettled: () => {
      console.log("like settled")
      utils.blog.getPostBySlug.invalidate({ slug })
    },
  })

  const onLikeOrDislikePost = useCallback(
    async (dislike: boolean) => {
      if (!userSession) {
        errorAlert("You should login")
        setShowModal(true)
        return
      }
      await createLike.mutateAsync({
        postId: id,
        dislike,
      })
    },
    [createLike, id, userSession],
  )

  return (
    <Link href={`/${author.login}/${slug}`}>
      <CardWrapper>
        <Card.Image src={image} tw="h-48 w-full object-cover" alt="Post" />
        {/* <CardImage src={image} width={300} height={300} tw="h-48 w-full object-cover" alt="Post" /> */}
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
                  {likes?.map((like) => {
                    return like.userId === userSession?.userId ? (
                      <AiTwotoneLike
                        onClick={() => onLikeOrDislikePost(false)}
                        tw="text-primary"
                        size={20}
                      />
                    ) : (
                      <AiOutlineLike
                        onClick={() => onLikeOrDislikePost(true)}
                        size={20}
                      />
                    )
                  })}
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
)`border h-full min-h-max border-gray-700 hover:border-primary transition duration-500 ease-in-out cursor-pointer`
const CardTitle = tw(Card.Title)`line-clamp-3 text-white text-2xl mb-auto`
const CardBody = tw(Card.Body)`px-6 pt-2  `
const CardDate = tw.p`text-gray-400 text-opacity-80 text-xs mt-2`
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
const CardImage = tw(Image)``

export default PostCard
