import React from "react"
import { useSession } from "next-auth/react"

import Layout from "@/components/layout"

export default function Profile() {
  const { data } = useSession()
  console.log("data", data)
  return (
    <Layout>
      <div>
        <h1>Profile</h1>
      </div>
    </Layout>
  )
}
