import React, { useEffect, useRef, useState } from "react"
import tw from "twin.macro"
import { useDebounce } from "usehooks-ts"

import { api } from "@/utils/api"
import useScreenView from "@/lib/useScreenView"
import Layout from "@/components/layout"
import PostContent from "@/components/postContent"
import SearchInput from "@/components/searchInput"

export default function SearchPage() {
  const [query, setQuery] = useState<string>("")
  const debouncedValue = useDebounce<string>(query, 500)

  const bottomRef = useRef<HTMLDivElement>(null)
  const isReachedBottom = useScreenView(bottomRef)

  const {
    data,
    refetch,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.blog.getPosts.useInfiniteQuery(
    {
      query: debouncedValue,
      limit: 8,
    },
    {
      enabled: !!query,
      getNextPageParam: (lastPage: any) => lastPage.nextCursor,
    },
  )

  //   useEffect(() => {
  //     refetch({})
  //   }, [debouncedValue])

  useEffect(() => {
    if (isReachedBottom && hasNextPage) {
      fetchNextPage()
    }
  }, [isReachedBottom])

  return (
    <Layout>
      <Wrapper>
        <SearchInput query={query} setQuery={setQuery} />
        <PostContent data={data} isFetchingNextPage={isFetchingNextPage} isLoading={isLoading} />
        <div ref={bottomRef} />
      </Wrapper>
    </Layout>
  )
}

const Wrapper = tw.div`flex flex-col gap-8`
