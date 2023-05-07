import React from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button, Progress } from "react-daisyui"
import InfiniteScroll from "react-infinite-scroll-component"
import tw from "twin.macro"

import { api } from "@/utils/api"
import Layout from "@/components/layout"
import PostCard from "@/components/postCard"
import PostContent from "@/components/postContent"
import { IPost } from "@/@types/types"

const LIMIT_ITEMS_PER_PAGE: number = 8

function HomePage() {
  //   const { data: session, status } = useSession()

  const { data, status, isLoading, fetchNextPage, hasNextPage } =
    api.blog.getAllPosts.useInfiniteQuery(
      {
        limit: LIMIT_ITEMS_PER_PAGE,
		published: true
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    )

  if (isLoading) {
    return (
      <Layout>
        <Progress />
      </Layout>
    )
  }

  return (
    <Layout>
      <PostContent
        data={data as any}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        limitItem={LIMIT_ITEMS_PER_PAGE}
      />
    </Layout>
  )
}

export default HomePage
