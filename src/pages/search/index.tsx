import React from "react"
import { Form, Input } from "react-daisyui"

import Layout from "@/components/layout"

export default function SearchPage() {
  return (
    <Layout>
      <Form>
        <Input bordered type="text" placeholder="Search" color="primary" />
      </Form>
    </Layout>
  )
}
