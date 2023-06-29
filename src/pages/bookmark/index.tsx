import React from "react"
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"

import Layout from "@/components/layout"
import { generateSSGHelper } from "@/server/helpers/ssgHelper"

export default function BookmarkPage() {
  return <Layout>BookmarkPage</Layout>
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const ssg = generateSSGHelper()
  const userSession = await getSession({ req })
  //   ssg.setCache("settings", "settings")

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
