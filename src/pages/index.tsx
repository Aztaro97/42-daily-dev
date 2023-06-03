import React, { useEffect, useRef } from "react"
import { Progress } from "react-daisyui"

import { api } from "@/utils/api"
import useScreenView from "@/lib/useScreenView"
import Layout from "@/components/layout"
import NextSeo from "@/components/nextSeo"
import PostContent from "@/components/postContent"

export const LIMIT_ITEMS_PER_PAGE: number = 9

function HomePage() {
  const bottomRef = useRef<HTMLDivElement>(null)
  const isReachedBottom = useScreenView(bottomRef)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    api.blog.getAllPosts.useInfiniteQuery(
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
    <>
      <NextSeo
        title="Home"
        description="Home"
        canonical=""
        openGraph={{
          url: "",
          title: "Home Page",
          description: "Home Page",
          images: [
            {
              url: "https://picsum.photos/200/300",
              width: 800,
              height: 600,
              alt: "Home Page",
            },
          ],
        }}
      />
      <Layout>
        <PostContent
          data={data as any}
          isFetchingNextPage={isFetchingNextPage}
        />
        <div ref={bottomRef} />
      </Layout>
    </>
  )
}

export default HomePage
