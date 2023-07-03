import React from "react"
import tw from "twin.macro"

import { IUser } from "@/@types/nextauth"
import { ITags, IUserImage } from "@/@types/types"
import RelatedPostCard from "./relatedPostCard"

interface post {
  id: string
  title: string
  slug: string
  tags: ITags[]
  author: IUser | null
}

interface props {
  relatedData: post[] | undefined | any[]
  isLoadingRelated: boolean
}

const RelatedPosts = ({ relatedData, isLoadingRelated }: props) => {
  return (
    <Container>
      <h1 className="mb-2 text-xl text-white">Related Posts</h1>
      <div className="flex flex-col gap-1">
        {relatedData &&
          relatedData.map((post, index) => (
            <RelatedPostCard key={index} {...post} />
          ))}

        {/* If Data is fetching , Show the Skeleton */}
        {isLoadingRelated &&
          [...Array(3).keys()].map((_, index) => (
            <RelatedPostCard.Skeleton key={index} />
          ))}
      </div>
    </Container>
  )
}

const Container = tw.div``

export default RelatedPosts
