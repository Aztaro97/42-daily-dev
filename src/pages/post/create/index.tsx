import React from "react"

import Editor from "@/components/editor"
import Layout from "@/components/layout"

export default function CreateNewPost() {
  return (
    <Layout>
      <Editor
        post={{
          id: "Hellowdjwkdkqdnq",
          title: "Hello word",
          content: null,
          published: false,
        }}
      />
    </Layout>
  )
}
