import React, { FC, useRef } from "react"
import tw from "twin.macro"

import { IPost } from "@/@types/types"
import PostCard from "../postCard"

interface postContentProps {
  data: any
  isFetchingNextPage: boolean
  isLoading: boolean
}

const PostContent: FC<postContentProps> = ({
  data,
  isFetchingNextPage,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <GridWrapper>
        {[...Array(6).keys()].map((_, index) => (
          <PostCard.Skeleton key={index} />
        ))}
      </GridWrapper>
    )
  }

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
      {isFetchingNextPage && (
        <GridWrapper>
          {[...Array(3).keys()].map((_, index) => (
            <PostCard.Skeleton key={index} />
          ))}
        </GridWrapper>
      )}
    </>
  )
}

const GridWrapper = tw.div`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-between gap-5 w-full mb-5`

export default PostContent
