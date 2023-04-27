import React from "react"
import { useSession } from "next-auth/react"

import Editor from "@/components/editor"
import Layout from "@/components/layout"

export default function CreateNewPost() {
  const { data: session } = useSession()

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  }

  return (
    <Layout>
      <Editor
        post={{
          id: "Hellowdjwkdkqdnq",
          title: "",
          content: null,
          tags: [
            {
              name: "minishell",
            },
            {
              name: "minishell",
            },
          ],
          published: false,
        }}
      />
    </Layout>
  )
}
