import React from "react"
import { GetServerSideProps } from "next"

import Layout from "@/components/layout"
import { getServerAuthSession } from "@/server/auth"
import { generateSSGHelper } from "@/server/helpers/ssgHelper"

export default function BookmarkPage() {
  return <Layout>BookmarkPage</Layout>
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const userSession = await getServerAuthSession({ req, res })

  if (!userSession?.user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
