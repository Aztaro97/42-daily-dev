import React from "react"
import { GetStaticPaths, GetStaticProps } from "next"
import { notFound } from "next/navigation"
import dayjs from "dayjs"
import tw from "twin.macro"

import { api } from "@/utils/api"
import { getBrowserInfo } from "@/lib/getBrowserInfo"
import HeadSEO from "@/components/headSeo"
import Layout from "@/components/layout"
import PostDetails from "@/components/postDetails"
import RelatedPosts from "@/components/relatedPosts"
import { DefaultPostImg, DefaultProfileImg } from "@/assets"
import CustomPage404 from "@/pages/404"
import { generateSSGHelper } from "@/server/helpers/ssgHelper"

export default function PostPage({ slug }: { slug: string }) {
  const { data, isLoading } = api.blog.getPostBySlug.useQuery(
    { slug },
    {
      enabled: !!slug,
    },
  )

  if (!data && !isLoading) {
    return <CustomPage404 title="Page Not Fund !" />
  }

  return (
    <>
      <HeadSEO
        title={data?.title || ""}
        description="Description about the post"
        openGraph={{
          url: getBrowserInfo().url,
          title: data?.title,
          description: "Home Page",
          type: "article",
          article: {
            publishedTime: dayjs(data?.createdAt).toISOString(),
            authors: [
              `${data?.author?.name} <${data?.author?.email}> (${data?.author?.login})`,
            ],
            tags: data?.tags.map((tag: any) => tag.name),
          },
          images: [
            {
              url: (data?.image ?? DefaultPostImg.src) as string,
              width: 800,
              height: 600,
              alt: data?.title,
            },
          ],
        }}
      />
      <Layout>
        <Grid>
          {isLoading ? <PostDetails.Skeleton /> : <PostDetails data={data} />}
          <RelatedPosts />
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

const Grid = tw.div`grid grid-cols-1 lg:grid-cols-[minmax(180px, 1fr)_200px] gap-10`
