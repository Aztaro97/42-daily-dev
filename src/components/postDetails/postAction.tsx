import React, { FC, useCallback, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { BiCommentDots } from "react-icons/bi"
import { RiHeart2Fill } from "react-icons/ri"

import { api } from "@/utils/api"
import { IPost } from "@/@types/types"
import { infoAlert } from "../alert"

interface props {
  data: IPost | any
}

const PostAction = ({ data }: props) => {
  const [likeByMe, setLikeByMe] = useState<boolean>(false)

  const { data: userSession } = useSession()
  const tRpcUtils = api.useContext()
  const toggleLike = api.like.toggleLike.useMutation({
    onMutate: async ({ dislike, postId }) => {
      const dislikeCount = dislike ? 1 : -1
      await tRpcUtils.blog.getPostBySlug.cancel({ slug: data.slug })

      const prevPost = tRpcUtils.blog.getPostBySlug.getData({ slug: data.slug })

      //   Updated Like count from post
      tRpcUtils.blog.getPostBySlug.setData(
        { slug: data.slug },
        (oldData: any) => {
          return {
            ...oldData,
            likes: !oldData.likes.length
              ? oldData.likes.concat({
                  dislike: dislike,
                  userId: userSession?.userId,
                })
              : oldData.likes.map((like: any) => {
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
              ...oldData._count,
              likes: oldData._count.likes + dislikeCount,
            },
          }
        },
      )
      return {
        prevPost,
      }
    },
    onError(error, variables, context) {
      tRpcUtils.blog.getPostBySlug.setData(
        { slug: data.slug },
        { ...(context?.prevPost as any) },
      )
    },
    // Alway Refresh after success or error
    onSettled: () => {
      tRpcUtils.blog.getPostBySlug.invalidate({ slug: data.slug })
    },
    onSuccess: (data) => {
      console.log("like success")
    },
  })

  const onLikeOrDislikePost = useCallback(
    async (dislike: boolean) => {
      if (!userSession) {
        infoAlert("You should login")
      }
      if (userSession && userSession.userId) {
        toggleLike.mutate({
          postId: data.id,
          dislike,
        })
      }
    },
    [toggleLike, data.id, userSession],
  )

  useEffect(() => {
    // Check if the user have liked a post
    // Set False by default if any post liked
    const liked =
      !!data.likes.some(
        (like: any) => like.userId == userSession?.userId && like.dislike,
      ) || false
    setLikeByMe(liked)
  }, [likeByMe, data.likes, userSession])
  return (
    <div className="flex space-x-3">
      <div className="flex space-x-1">
        {likeByMe ? (
          <RiHeart2Fill
            tw="text-primary cursor-pointer"
            size={25}
            onClick={() => onLikeOrDislikePost(false)}
          />
        ) : (
          <RiHeart2Fill
            tw="cursor-pointer"
            size={25}
            onClick={() => onLikeOrDislikePost(true)}
          />
        )}
        <span>{data._count.likes}</span>
      </div>
      <div className="flex space-x-1">
        <BiCommentDots size={25} />
        <span>{data._count.comments}</span>
      </div>
    </div>
  )
}

export default PostAction
