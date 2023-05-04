import React from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button, Progress } from "react-daisyui"
import InfiniteScroll from "react-infinite-scroll-component"
import tw from "twin.macro"

import { api } from "@/utils/api"
import Layout from "@/components/layout"
import PostCard from "@/components/postCard"
import { IPost } from "@/@types/types"

const LIMIT_ITEMS_PER_PAGE: number = 6

function HomePage() {
  //   const { data: session, status } = useSession()

  const { data, status, isLoading, fetchNextPage, hasNextPage } =
    api.blog.getAllPosts.useInfiniteQuery(
      {
        limit: LIMIT_ITEMS_PER_PAGE,
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
      <InfiniteScroll
        dataLength={data?.pages.length * LIMIT_ITEMS_PER_PAGE}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={<>Loading ...</>}
      >
        <GridWrapper>
          {data?.pages.map((page) => (
            <>
              {page?.posts.map((post) => (
                <PostCard key={post.id} {...post} />
              ))}
            </>
          ))}
        </GridWrapper>
      </InfiniteScroll>
    </Layout>
  )
}

const GridWrapper = tw.div`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-7`

export default HomePage
