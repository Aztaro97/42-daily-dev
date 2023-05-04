import React from "react"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"

import { api } from "@/utils/api"
import Editor from "@/components/editor"
import Layout from "@/components/layout"

export default function CreateNewPost() {
  const { data: session } = useSession()

  const router = useRouter()
  const postId = router.query?.postId as string

  const { data, isLoading } = api.blog.getPostForUserById.useQuery({
    postId,
  })

  console.log("data", data)

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  }

  if (!data) {
    return <div>Page Not Fund...</div>
  }

  if (isLoading) {
    return (
      <Layout>
        <h1>Loading...</h1>
      </Layout>
    )
  }

  return (
    <Layout>
      <Editor
        post={{
          id: data?.id,
          title: data?.title,
          content: data?.content,
          tags: data?.tags,
          published: data.published,
          coverImage: data?.image,
        }}
      />
    </Layout>
  )
}
