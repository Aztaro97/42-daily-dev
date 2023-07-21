import React from "react"
import { GetServerSideProps } from "next"

import { getServerAuthSession } from "@/server/auth"
import { generateSSGHelper } from "@/server/helpers/ssgHelper"

export default function AdminPage() {
  return <div>Admin Page</div>
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const ssg = generateSSGHelper()
  const userSession = await getServerAuthSession({ req, res })

  //   Check if the user is Admin
  if (userSession?.user.role !== "admin") {
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
