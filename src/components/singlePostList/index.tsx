import React from "react"
import tw from "twin.macro"

import PostCardTwo from "./singlePostCard"

interface props {
  data: any
  isFetchingNextPage: boolean
  isLoading: boolean
}

const SinglePostList = ({ data, isFetchingNextPage, isLoading }: props) => {
  if (isLoading) {
    return (
      <CardWrapper>
        {[...Array(5).keys()].map((_, index) => (
          <PostCardTwo.Skeleton key={index} />
        ))}
      </CardWrapper>
    )
  }

  return (
    <>
      <CardWrapper>
        {data?.pages.map((page: any) => (
          <>
            {page.posts.map((post: any) => (
              <PostCardTwo key={post.id} {...post} />
            ))}
          </>
        ))}
      </CardWrapper>
      {isFetchingNextPage && <PostCardTwo.Skeleton />}
    </>
  )
}
const CardWrapper = tw.div`flex flex-col gap-5`

export default SinglePostList
