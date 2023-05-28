import React, { FC, useRef } from "react"
import tw from "twin.macro"

import { IPost } from "@/@types/types"
import PostCard from "../postCard"

interface postContentProps {
  data: any
  isFetchingNextPage: boolean
}

const PostContent: FC<postContentProps> = ({ data, isFetchingNextPage }) => {
  return (
    <>
      <GridWrapper>
        {data?.pages.map((page: any) => (
          <>
            {page?.posts.map((post: IPost) => (
              <PostCard key={post.id} {...post} />
            ))}
          </>
        ))}
      </GridWrapper>

      {isFetchingNextPage && <h1>Loading more data...</h1>}
    </>
  )
}

const GridWrapper = tw.div`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-between gap-5 w-full`

export default PostContent
