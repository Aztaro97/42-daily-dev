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
import CommentCard from "../commentCard"

type FormData = z.infer<typeof commentSchema>

interface commenterProps {
  id: string
  content: string
  author: IUser
}

interface props {
  postId: string
  slug: string
  commentData: commenterProps[]
}

const CommentField: FC<props> = ({ postId, commentData, slug }) => {
  return (
    <div>
      <CommentForm postId={postId} slug={slug} />
      {commentData.length > 0 ? (
        <CommentWrapper>
          {commentData.map((comment) => (
            <CommentCard key={comment.id} {...comment} />
          ))}
        </CommentWrapper>
      ) : null}
    </div>
  )
}

const CommentForm = ({ postId }: { postId: string; slug: string }) => {
  const { data: userSession } = useSession()

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
      <h1 className="mb-2 text-xl text-white">Comments</h1>
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
