import React from "react"
import { useRouter } from "next/router"

import { api } from "@/utils/api"
import CustomButton from "../ui/customButton"

const CreatePostButton = () => {
  const router = useRouter()

  const createPost = api.blog.createPost.useMutation({
    onSuccess: (data) => {
      if (data) {
        router.push(`/post/edit/${data.id}`)
      }
    },
  })

  const handleCreate = async () => {
    await createPost.mutateAsync({
      title: "Untitled Post",
    })
  }

  return (
    <CustomButton
      disabled={createPost.isLoading}
      loading={createPost.isLoading}
      onClick={handleCreate}
    >
      Create Post
    </CustomButton>
  )
}

export default CreatePostButton
