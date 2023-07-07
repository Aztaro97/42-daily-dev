import React, { FC, useEffect, useRef, useState } from "react"
import { GetServerSideProps } from "next"
import tw from "twin.macro"

import { api } from "@/utils/api"
import useScreenView from "@/lib/useScreenView"
import CreatePostButton from "@/components/createPostButton"
import Layout from "@/components/layout"
import PostCardTwo from "@/components/singlePostList"
import SinglePostList from "@/components/singlePostList"
import { getServerAuthSession } from "@/server/auth"
import { generateSSGHelper } from "@/server/helpers/ssgHelper"

const LIMIT_ITEM: number = 8

export default function PostPage() {
  const bottomRef = useRef<HTMLDivElement>(null)
  const isReachedBottom = useScreenView(bottomRef)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    api.blog.getAllUserPost.useInfiniteQuery(
      {
        limit: LIMIT_ITEM,
      },
      {
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
      },
    )

  useEffect(() => {
    if (isReachedBottom && hasNextPage) {
      fetchNextPage()
    }
  }, [isReachedBottom])

  return (
    <Layout>
      <Box>
        <div>
          <Heading>Posts</Heading>
          <Text>Create and manage posts.</Text>
        </div>
        <CreatePostButton />
      </Box>
      <SinglePostList
        isFetchingNextPage={isFetchingNextPage}
        data={data}
        isLoading={isLoading}
      />
      <div ref={bottomRef} />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const ssg = generateSSGHelper()
  const userSession = await getServerAuthSession({ req, res })
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

const Box = tw.div`flex items-center justify-between gap-5 mb-8`
const Heading = tw.h1`text-white text-2xl`
const Text = tw.h1``
