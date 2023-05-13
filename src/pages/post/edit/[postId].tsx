import React from "react"
import { GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"

import { api } from "@/utils/api"
import Editor from "@/components/editor"
import Layout from "@/components/layout"
import { generateSSGHelper } from "@/server/helpers/ssgHelper"

export default function CreateNewPost() {
  const { data: session } = useSession()

  const router = useRouter()
  const postId = router.query?.postId as string

  const { data, isLoading } = api.blog.getPostForUserById.useQuery({
    postId,
  })

  //   if (!session) {
  //     return {
  //       redirect: {
  //         destination: "/login",
  //         permanent: false,
  //       },
  //     }
  //   }

  console.log("data", data)

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
          id: data?.id || "",
          title: data?.title || "",
          content: (data?.content as string) || "",
          tags: data?.tags || [],
          published: data?.published || false,
          coverImage: data?.image && [],
        }}
      />
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const ssg = generateSSGHelper()

  const postId = params?.postId as string

  if (typeof postId !== "string")
    throw new Error("The Post Id should be a string")

  await ssg.blog.getPostForUserById.prefetch({ postId })

  return {
    props: {
      trpcState: ssg.dehydrate(),
      postId,
    },
  }
}
