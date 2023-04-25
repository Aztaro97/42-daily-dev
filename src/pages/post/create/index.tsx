import React from "react"

import Editor from "@/components/editor"
import Layout from "@/components/layout"

export default function CreateNewPost() {
  return (
    <Layout>
      <Editor
        post={{
          id: "Hellowdjwkdkqdnq",
          title: "",
          content: null,
          published: false,
        }}
      />
    </Layout>
  )
}
