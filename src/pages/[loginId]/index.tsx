import React, { FC, useState } from "react"
import { GetStaticPaths, GetStaticProps } from "next"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { Tabs } from "react-daisyui"
import { FaFacebookSquare } from "react-icons/fa"

import { api } from "@/utils/api"
import Layout from "@/components/layout"
import PostContent from "@/components/postContent"
import CustomButton from "@/components/ui/customButton"
import { IUser } from "@/@types/nextauth"
import { generateSSGHelper } from "@/server/helpers/ssgHelper"
import CustomPage404 from "../404"
import tw from "twin.macro"

const LIMIT_ITEM: number = 5
const { Tab } = Tabs

export default function StudentProfile({ login }: { login: string }) {
  const [tabValue, setTabValue] = useState(0)

  const { data: userInfo, isLoading } = api.user.getUserProfileByLogin.useQuery(
    {
      login,
    },
  )

  if (isLoading) {
    return <>Loading...</>
  }

  if (!userInfo) {
    return <CustomPage404 title="Page Not Fund!" />
  }

  return (
    <Layout>
      <CardProfile {...userInfo} />
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
        <PostCreated userId={userInfo?.id} />
      ) : (
        <PostLiked userId={userInfo?.id} />
      )}
    </Layout>
  )
}

const PostCreated = ({ userId }: { userId: string }) => {
  const { data, isLoading, fetchNextPage, hasNextPage } =
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

  if (isLoading) {
    return <>Loading...</>
  }
  return (
    <PostContent
      data={data as any}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      limitItem={LIMIT_ITEM}
    />
  )
}

const PostLiked = ({ userId }: { userId: string }) => {
  const router = useRouter()
  const login = router.query?.loginId as string
  const { data, isLoading, fetchNextPage, hasNextPage } =
    api.blog.getPostsLiked.useInfiniteQuery(
      { userId, limit: LIMIT_ITEM, published: false },
      {
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
      },
    )

  console.log("data==", data)

  if (isLoading) {
    return <>Loading...</>
  }
  return (
    <PostContent
      data={data as any}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      limitItem={LIMIT_ITEM}
    />
  )
}

const CardProfile: FC<IUser> = ({ email, image, name, login }) => {
  return (
    <div className="grid items-start justify-center max-w-4xl grid-cols-2 gap-10 mx-auto">
      <figure>
        <ProfileImage
          src={image.link}
          width={900}
          height={900}
          alt="Picture"
          className=""
        />
      </figure>
      <div className="h-full">
        <div className="flex items-center justify-between gap-5">
          <h2 className="mb-1 text-3xl ">{name}</h2>
          <CustomButton bgColor="primary">Folllow</CustomButton>
        </div>
        <p className="mb-3 text-primary">{`@${login}`}</p>
        <p className="p-4 mb-5 border-l border-primary">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perferendis
          aspernatur saepe vero?
        </p>

        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center justify-start gap-5">
            <div className="flex flex-col items-center justify-center w-24 h-24 shadow shadow-primary">
              <h3 className="text-xl">50</h3>
              <p>Posts</p>
            </div>
            <div className="flex flex-col items-center justify-center w-24 h-24 shadow shadow-primary">
              <h3 className="text-xl">50</h3>
              <p>Followers</p>
            </div>
            <div className="flex flex-col items-center justify-center w-24 h-24 shadow shadow-primary">
              <h3 className="text-xl">50</h3>
              <p>Following</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-2">
            <Link href={"/"}>
              <FaFacebookSquare size={27} />
            </Link>
            <Link href={"/"}>
              <FaFacebookSquare size={27} />
            </Link>
            <Link href={"/"}>
              <FaFacebookSquare size={27} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const ProfileImage = tw(Image)`max-w-[600px] w-full h-[300px] object-cover object-center rounded-md`

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
