import React from "react"
import { GetStaticPaths, GetStaticProps } from "next"
import dayjs from "dayjs"
import tw from "twin.macro"

import { api } from "@/utils/api"
import { strippedToHTML } from "@/utils/utils"
import { getBrowserInfo } from "@/lib/getBrowserInfo"
import HeadSEO from "@/components/headSeo"
import Layout from "@/components/layout"
import PostDetails from "@/components/postDetails"
import RelatedPosts from "@/components/relatedPosts"
import { IPost } from "@/@types/types"
import { DefaultPostImg, DefaultProfileImg } from "@/assets"
import CustomPage404 from "@/pages/404"
import { generateSSGHelper } from "@/server/helpers/ssgHelper"

export default function PostPage({ slug }: { slug: string }) {
  const { data: postData, isLoading } = api.blog.getPostBySlug.useQuery(
    { slug },
    {
      enabled: !!slug,
    },
  )

  const { data: relatedData, isLoading: isLoadingRelated } =
    api.blog.getRelatedPosts.useQuery(
      {
        slug,
      },
      { enabled: !!slug },
    )

  return (
    <>
      <HeadSEO
        title={postData?.title || ""}
        description={strippedToHTML(postData?.content!)}
        openGraph={{
          url: getBrowserInfo().url,
          title: postData?.title,
          description: `${strippedToHTML(postData?.content!)}`,
          type: "article",
          article: {
            publishedTime: dayjs(postData?.createdAt).toISOString(),
            authors: [
              `${postData?.author?.name} <${postData?.author?.email}> (${postData?.author?.login})`,
            ],
            tags: postData?.tags.map((tag: any) => tag.name),
          },
          images: [
            {
              url: (postData?.image ?? DefaultPostImg.src) as string,
              width: 800,
              height: 600,
              alt: postData?.title,
            },
          ],
        }}
      />
      <Layout>
        <Grid>
          {isLoading ? (
            <PostDetails.Skeleton />
          ) : (
            <PostDetails data={postData} />
          )}
          <RelatedPosts
            relatedData={relatedData}
            isLoadingRelated={isLoadingRelated}
          />
        </Grid>
      </Layout>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  }
}
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const ssg = generateSSGHelper()

  const slug = params?.slug as string

  if (typeof slug !== "string") throw new Error("The slug should be a string")

  await ssg.blog.getPostBySlug.prefetch({ slug })

  return {
    props: {
      trpcState: ssg.dehydrate(),
      slug,
    },
  }
}

const Grid = tw.div`grid grid-cols-1 lg:grid-cols-[minmax(180px, 1fr)_250px] gap-5`
