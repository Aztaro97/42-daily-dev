import React from "react"
import tw from "twin.macro"

import Layout from "@/components/layout"
import PodCastCard from "@/components/podcastCard"
import PostCard from "@/components/postCard"

const PodcastPage = () => {
  return (
    <Layout>
      <GridWrapper>
        <PodCastCard />
        <PodCastCard />
        <PodCastCard />
        <PodCastCard />
        <PodCastCard />
      </GridWrapper>
    </Layout>
  )
}

const GridWrapper = tw.div`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-7`

export default PodcastPage
