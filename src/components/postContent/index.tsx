import React, { FC } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import tw from "twin.macro"

import { IPost } from "@/@types/types"
import PostCard from "../postCard"

interface postContentProps {
  data: any
  fetchNextPage: any
  hasNextPage: boolean | undefined
  limitItem: number
}

const PostContent: FC<postContentProps> = ({
  data,
  fetchNextPage,
  hasNextPage,
  limitItem,
}) => {
  return (
    <InfiniteScroll
      dataLength={(data?.pages.length || 0) * limitItem}
      next={fetchNextPage}
      hasMore={hasNextPage as boolean}
      loader={<>Loading ...</>}
    >
      <GridWrapper>
        {data?.pages.map((page: any) => (
          <>
            {page?.posts.map((post: IPost) => (
              <PostCard key={post.id} {...post} />
            ))}
          </>
        ))}
      </GridWrapper>
    </InfiniteScroll>
  )
}

const GridWrapper = tw.div`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-7`

export default PostContent
