import React, { useEffect, useRef } from "react"
import { Button, Progress } from "react-daisyui"
import tw from "twin.macro"

import { api } from "@/utils/api"
import useScreenView from "@/lib/useScreenView"
import Layout from "@/components/layout"
import PostCard from "@/components/postCard"
import PostContent from "@/components/postContent"
import { IPost } from "@/@types/types"

const LIMIT_ITEMS_PER_PAGE: number = 9

function HomePage() {
  const bottomRef = useRef<HTMLDivElement>(null)
  const isReachedBottom = useScreenView(bottomRef)

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.blog.getAllPosts.useInfiniteQuery(
    {
      limit: LIMIT_ITEMS_PER_PAGE,
      published: true,
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

  if (isLoading) {
    return (
      <Layout>
        <Progress />
      </Layout>
    )
  }

  return (
    <Layout>
      <PostContent data={data as any} isFetchingNextPage={isFetchingNextPage} />
      <div ref={bottomRef} />
    </Layout>
  )
}

export default HomePage
