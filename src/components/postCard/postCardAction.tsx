import React, { useCallback, useEffect, useState } from "react"
import styled from "@emotion/styled"
import { useSession } from "next-auth/react"
import { Tooltip } from "react-daisyui"
import { BiCommentDots } from "react-icons/bi"
import { RiHeart2Fill, RiHeart2Line } from "react-icons/ri"
import { SlEye } from "react-icons/sl"
import tw from "twin.macro"

import { api } from "@/utils/api"
import { LIMIT_ITEMS_PER_PAGE } from "@/pages"
import { infoAlert } from "../alert"

interface props {
  id: string
  _count: any
  likes: any
}

const PostCardAction = ({ id, _count, likes }: props) => {
  const [likeByMe, setLikeByMe] = useState<boolean>(false)
  const { data: userSession } = useSession()

  const tRpcUtils = api.useContext()

  const toggleLike = api.like.toggleLike.useMutation({
    onMutate: async ({ dislike, postId }) => {
      const dislikeCount = dislike ? 1 : -1

      await tRpcUtils.blog.getAllPosts.cancel()

      //   Update Like Count from list all post
      const previousAllPost = tRpcUtils.blog.getAllPosts.getInfiniteData({
        limit: LIMIT_ITEMS_PER_PAGE,
        published: true,
      })

      tRpcUtils.blog.getAllPosts.setInfiniteData(
        { limit: LIMIT_ITEMS_PER_PAGE, published: true },
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
        previousAllPost,
      }
    },

    // If the mutate fails
    // We'll use the context to returned from onMutate to roll back
    onError: (error, newData, context) => {
      console.log(error)
      tRpcUtils.blog.getAllPosts.setInfiniteData(
        { limit: LIMIT_ITEMS_PER_PAGE, published: true },
        { ...(context?.previousAllPost as any) },
      )
    },

    // Alway Refresh after success or error
    onSettled: () => {
      tRpcUtils.blog.getAllPosts.invalidate({ limit: 8 })
    },

    onSuccess: (data) => {
      console.log("like success")
      //   console.log("data", data)
    },
  })

  const onLikeOrDislikePost = useCallback(
    async (dislike: boolean) => {
      if (!userSession) {
        infoAlert("You should login")
      }
      if (userSession && userSession.userId) {
        toggleLike.mutate({
          postId: id,
          dislike,
        })
      }
    },
    [toggleLike, id, userSession],
  )

  useEffect(() => {
    // Check if the user have liked a post
    // Set False by default if any post liked
    const liked =
      !!likes.some(
        (like: any) => like.userId == userSession?.userId && like.dislike,
      ) || false
    setLikeByMe(liked)
  }, [likeByMe, likes, userSession])
  return (
    <CardRightAction>
      <Tooltip color="primary" message="View">
        <CardActionIcon>
          <SlEye size={25} tw="!stroke-gray-400" />
          <span>{_count?.views}</span>
        </CardActionIcon>
      </Tooltip>
      <Tooltip color="primary" message="Comment">
        <CardActionIcon tw="border-x border-gray-400 border-opacity-40 px-3">
          <BiCommentDots size={25} />
          <span>{_count?.comments}</span>
        </CardActionIcon>
      </Tooltip>
      <Tooltip color="primary" message="Like">
        <CardActionIcon>
          {likeByMe ? (
            <RiHeart2Fill
              onClick={() => onLikeOrDislikePost(false)}
              tw="text-primary"
              size={25}
            />
          ) : (
            <RiHeart2Line onClick={() => onLikeOrDislikePost(true)} size={25} />
          )}

          <span>{_count.likes}</span>
        </CardActionIcon>
      </Tooltip>
    </CardRightAction>
  )
}

const CardActionIcon = styled.div`
  ${tw`flex items-center gap-1 px-1 text-gray-400`}

  & span {
    ${tw`text-sm text-gray-400`}
  }
`
const CardRightAction = tw.div`flex gap-2`

export default PostCardAction
