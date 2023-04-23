import React from "react"
import Image from "next/image"
import tw from "twin.macro"

import AudioPlayer from "@/components/audioPlayer"
import Layout from "@/components/layout"

export default function SinglePodCast() {
  return (
    <Layout>
      <GridStyled>
        <PodcastWrapper>
          <Banner>
            <BannerImage
              src="https://daily-now-res.cloudinary.com/image/upload/v1679306271/96835229db75693a44e598609fe73bbb.jpg"
              width={900}
              height={400}
              alt="Podcast"
            />
            <AudioPlayer
              src={
                "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
              }
            />
          </Banner>
        </PodcastWrapper>
        <RelatedPodcastWrapper>Related Podcast</RelatedPodcastWrapper>
      </GridStyled>
    </Layout>
  )
}

const GridStyled = tw.section`grid grid-cols-1 lg:grid-cols-2 gap-10`
const PodcastWrapper = tw.article``
const RelatedPodcastWrapper = tw.article``
const Banner = tw.div``
const BannerImage = tw(Image)``
const AudioPlayerWrapper = tw.div``
