import React, { FC, useEffect, useRef, useState } from "react"
import { GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/router"
import { Tabs } from "react-daisyui"

import { api } from "@/utils/api"
import { getBrowserInfo } from "@/lib/getBrowserInfo"
import useScreenView from "@/lib/useScreenView"
import EditProfileModal from "@/components/editProfileModal"
import HeadSEO from "@/components/headSeo"
import Layout from "@/components/layout"
import PostContent from "@/components/postContent"
import UploadUserPicture from "@/components/uploadUserPicture"
import UserProfile from "@/components/userProfile"
import { DefaultProfileImg } from "@/assets"
import { generateSSGHelper } from "@/server/helpers/ssgHelper"
import useStore from "@/stores/useStore"
import CustomPage404 from "../404"

const LIMIT_ITEM: number = 6
const { Tab } = Tabs

export default function StudentProfile({ login }: { login: string }) {
  const [tabValue, setTabValue] = useState(0)
  const [showPictureModal, setShowPictureModal] = useState<boolean>(false)

  const { data: userInfo, isLoading } = api.user.getUserProfileByLogin.useQuery(
    {
      login,
    },
  )

  if (!userInfo && !isLoading) {
    return <CustomPage404 title="Page Not Fund!" />
  }

  return (
    <>
      <HeadSEO
        title={userInfo?.name as string}
        description={userInfo?.bio as string}
        openGraph={{
          url: getBrowserInfo().url,
          title: userInfo?.name as string,
          description: userInfo?.bio as string,
          images: [
            {
              url: (userInfo?.image ?? DefaultProfileImg.src) as string,
              width: 800,
              height: 600,
              alt: userInfo?.name as string,
            },
          ],
        }}
      />

      <Layout>
        {/* @ts-ignore */}
        {isLoading ? <UserProfile.Skeleton /> : <UserProfile {...userInfo} />}

        <Tabs
          variant="bordered"
          size="lg"
          value={tabValue}
          onChange={setTabValue}
          className="flex justify-center mx-auto mt-12 mb-8"
        >
          <Tab value={0}>Post</Tab>
          <Tab value={1}>Likes</Tab>
        </Tabs>
        {tabValue === 0 ? (
          <PostCreated userId={userInfo?.id as string} />
        ) : (
          <PostLiked userId={userInfo?.id as string} />
        )}
      </Layout>
      <EditProfileModal />
      <UploadUserPicture
        currentImage={userInfo?.image as string}
        login={userInfo?.login as string}
      />
    </>
  )
}

const PostCreated = ({ userId }: { userId: string }) => {
  const bottomRef = useRef<HTMLDivElement>(null)
  const isReachedBottom = useScreenView(bottomRef)
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    api.blog.getAllPosts.useInfiniteQuery(
      {
        limit: LIMIT_ITEM,
        published: true,
        userId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    )

  useEffect(() => {
    if (isReachedBottom && hasNextPage) {
      fetchNextPage()
    }
  }, [isReachedBottom])

  return (
    <>
      <PostContent
        data={data as any}
        isFetchingNextPage={isFetchingNextPage}
        isLoading={isLoading}
      />
      <div ref={bottomRef} />
    </>
  )
}

const PostLiked = ({ userId }: { userId: string }) => {
  const router = useRouter()
  const login = router.query?.loginId as string
  const bottomRef = useRef<HTMLDivElement>(null)
  const isReachedBottom = useScreenView(bottomRef)

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    api.blog.getPostsLiked.useInfiniteQuery(
      { userId, limit: LIMIT_ITEM, published: false },
      {
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
      },
    )

  useEffect(() => {
    if (isReachedBottom && hasNextPage) {
      fetchNextPage()
    }
  }, [isReachedBottom])

  return (
    <>
      <PostContent
        data={data as any}
        isFetchingNextPage={isFetchingNextPage}
        isLoading={isLoading}
      />
      <div ref={bottomRef} />
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const ssg = generateSSGHelper()

  const login = params?.loginId as string

  if (typeof login !== "string") throw new Error("the Id should be a string")

  await ssg.user.getUserProfileByLogin.prefetch({ login })

  return {
    props: {
      trpcState: ssg.dehydrate(),
      login,
    },
  }
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  }
}
