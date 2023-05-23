import React, { useEffect } from "react"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { getSession, useSession } from "next-auth/react"

import { api } from "@/utils/api"
import Layout from "@/components/layout"
import { generateSSGHelper } from "@/server/helpers/ssgHelper"

export default function SettingsPage() {
  const router = useRouter()

  const { data: userData } = api.user.getMyProfile.useQuery()

  return <Layout>{JSON.stringify(userData)}</Layout>
}


export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const ssg = generateSSGHelper()
  const userSession = await getSession({ req })
  //   ssg.setCache("settings", "settings")

  if (!userSession) {
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
