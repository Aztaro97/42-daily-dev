import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { Avatar } from "react-daisyui"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

import { api } from "@/utils/api"
import FieldErrorMessage from "@/components/fieldErrorMessage"
import MarkdownEditor from "@/components/markdownEditor"
import CustomButton from "@/components/ui/customButton"
import { commentSchema } from "@/schema/postSchema"

type FormData = z.infer<typeof commentSchema>

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
      <CustomButton variants="primary" loading={createComment.isLoading}>
        Send
      </CustomButton>
    </form>
  )
}

export default CommentForm
