import React, { FC } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { Avatar } from "react-daisyui"
import { Controller, useForm } from "react-hook-form"
import tw from "twin.macro"
import { z } from "zod"

import { api } from "@/utils/api"
import FieldErrorMessage from "@/components/fieldErrorMessage"
import MarkdownEditor from "@/components/markdownEditor"
import CustomButton from "@/components/ui/customButton"
import { commentSchema } from "@/schema/postSchema"
import { IUser } from "@/@types/nextauth"
import { IComment } from "@/@types/types"
import CommentCard from "../commentCard"

type FormData = z.infer<typeof commentSchema>

interface commenterProps {
  id: string
  content: string
  author: IUser
}

interface props {
  postId: string
}

const CommentField: FC<props> = ({ postId }) => {
  const { data: commentData, isLoading } =
    api.comment.getCommentsByPostId.useQuery(
      { postId },
      {
        enabled: !!postId,
      },
    )

  if (isLoading) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    )
  }

  return (
    <div>
      <CommentForm postId={postId} />
      {isLoading ? (
        <h2>Loading...</h2>
      ) : (
        <>
          {commentData && commentData?.length > 0 ? (
            <CommentWrapper>
              {commentData.map((comment: any) => (
                <CommentCard key={comment.id} {...comment} postId={postId} />
              ))}
            </CommentWrapper>
          ) : null}
        </>
      )}
    </div>
  )
}

const CommentForm = ({ postId }: { postId: string }) => {
  const { data: userSession } = useSession()
  const tRpcUtils = api.useContext()

  const {
    handleSubmit,
    control,
    reset,
    resetField,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(commentSchema),
  })

  const createComment = api.comment.createComment.useMutation({
    onSuccess: () => {
      reset()

      //   This will refresh the comments
      tRpcUtils.comment.getCommentsByPostId.invalidate({ postId })
    },
  })

  const onSubmit = async (data: FormData) => {
    if (data) {
      await createComment.mutateAsync({
        content: data.content,
        postId,
      })
      resetField("content")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="mb-2 text-2xl text-white">Comments</h1>
      <div>
        <FieldErrorMessage errors={errors} name="content">
          <Controller
            name={"content"}
            control={control}
            render={({ field: { value, ...rest } }) => (
              <MarkdownEditor className="h-64" value={value} {...rest} />
            )}
          />
        </FieldErrorMessage>
      </div>
      <CustomButton bgColor="primary" loading={createComment.isLoading}>
        Send
      </CustomButton>
    </form>
  )
}

const CommentWrapper = tw.div`flex flex-col gap-4 my-5`

export default CommentField
