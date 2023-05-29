import React, { FC, useEffect, useRef, useState } from "react"
import { GetStaticPaths, GetStaticProps } from "next"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { Tabs } from "react-daisyui"
import { FaFacebookSquare } from "react-icons/fa"
import tw from "twin.macro"

import { api } from "@/utils/api"
import useScreenView from "@/lib/useScreenView"
import Layout from "@/components/layout"
import PostContent from "@/components/postContent"
import CustomButton from "@/components/ui/customButton"
import FollowButton from "@/components/ui/followButton"
import { IUser } from "@/@types/nextauth"
import { DefaultProfileImg } from "@/assets"
import { generateSSGHelper } from "@/server/helpers/ssgHelper"
import CustomPage404 from "../404"

const LIMIT_ITEM: number = 6
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
      {/* @ts-ignore */}
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

  if (isLoading) {
    return <>Loading...</>
  }
  return (
    <>
      <PostContent data={data as any} isFetchingNextPage={isFetchingNextPage} />
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

  if (isLoading) {
    return <>Loading...</>
  }
  return (
    <>
      <PostContent data={data as any} isFetchingNextPage={isFetchingNextPage} />
      <div ref={bottomRef} />
    </>
  )
}

interface cardProfileProps extends IUser {
  email: string
  //   name: string
  //   image: string
  login: string
  id: string | null
  //   followers: any[]
  //   _count: {
  //     posts: number
  //     followers: number
  //     following: number
  //   }
}

const CardProfile: FC<cardProfileProps> = ({
  email,
  image,
  name,
  login,
  id,
  followers,
  _count,
}) => {
  const setFollowUser = api.follow.setFollowUser.useMutation()
  const { data: userSession } = useSession()

  //   Check if the user is following the profile user
  //   @ts-ignore
  const isFollowing = followers.some((fol) => fol.followingId === id)

  return (
    <div className="grid items-start justify-center max-w-4xl grid-cols-1 gap-10 mx-auto lg:grid-cols-2">
      <figure>
        <ProfileImage
          src={image ?? DefaultProfileImg.src}
          width={900}
          height={900}
          alt="Picture"
          className=""
        />
      </figure>
      <div className="h-full">
        <div className="flex items-center justify-between gap-5">
          <h2 className="mb-1 text-3xl ">{name}</h2>
          {userSession?.userId === id ? (
            <Link href={"/settings"}>
              <CustomButton bgColor="primary" className="tracking-wider">
                Edit
              </CustomButton>
            </Link>
          ) : (
            <FollowButton
              login={login}
              followingId={id as string}
              isFollowing={isFollowing}
            />
          )}
        </div>
        <p className="mb-3 text-primary">{`@${login}`}</p>
        <p className="p-4 mb-5 border-l border-primary">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perferendis
          aspernatur saepe vero?
        </p>

        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center justify-start gap-5">
            <div className="flex flex-col items-center justify-center w-[5.5rem] h-24 shadow lg:w-24 lg:h-24 shadow-primary">
              <h3 className="text-xl">{_count.posts}</h3>
              <p>Posts</p>
            </div>
            <div className="flex flex-col items-center justify-center w-[5.5rem] h-24 shadow lg:w-24 lg:h-24 shadow-primary">
              <h3 className="text-xl">{_count.followers}</h3>
              <p>Followers</p>
            </div>
            <div className="flex flex-col items-center justify-center w-[5.5rem] h-24 shadow lg:w-24 lg:h-24 shadow-primary">
              <h3 className="text-xl">{_count.following}</h3>
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

const ProfileImage = tw(
  Image,
)`max-w-[600px] w-full h-[300px] object-cover object-center rounded-md`

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
