import React, { useEffect, useRef } from "react"
import { Progress } from "react-daisyui"

import { api } from "@/utils/api"
import { getBrowserInfo } from "@/lib/getBrowserInfo"
import useScreenView from "@/lib/useScreenView"
import HeadSEO from "@/components/headSeo"
import Layout from "@/components/layout"
import PostContent from "@/components/postContent"
import { DefaultPostImg } from "@/assets"
import { APP_DESCRIPTION, APP_NAME } from "@/constants/constants"

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

  return (
    <>
      <HeadSEO
        title={`${APP_NAME} | Home Page`}
        description={APP_DESCRIPTION}
        openGraph={{
          url: getBrowserInfo().url,
          title: `${APP_NAME} | Home Page`,
          description: APP_DESCRIPTION,
          images: [
            {
              url: DefaultPostImg.src,
              width: 800,
              height: 600,
              alt: `${APP_NAME} Logo`,
            },
          ],
        }}
      />
      <Layout>
        <PostContent
          data={data as any}
          isFetchingNextPage={isFetchingNextPage}
          isLoading={isLoading}
        />
        <div ref={bottomRef} />
      </Layout>
    </>
  )
}

export default HomePage
