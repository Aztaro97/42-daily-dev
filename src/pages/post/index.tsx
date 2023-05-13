import React, { FC, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import styled from "@emotion/styled"
import dayjs from "dayjs"
import { Button, Dropdown, Modal } from "react-daisyui"
import { TbDotsVertical } from "react-icons/tb"
import InfiniteScroll from "react-infinite-scroll-component"
import tw from "twin.macro"

import { api } from "@/utils/api"
import CreatePostButton from "@/components/createPostButton"
import Layout from "@/components/layout"
import { IUser } from "@/@types/nextauth"
import { IPost } from "@/@types/types"

const LIMIT_ITEM: number = 5

export default function PostPage() {
  const { data, isLoading, fetchNextPage, hasNextPage } =
    api.blog.getAllUserPost.useInfiniteQuery(
      {
        limit: LIMIT_ITEM,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    )

  if (isLoading) {
    return <Layout>Loading...</Layout>
  }

  return (
    <Layout>
      <Box>
        <div>
          <Heading>Posts</Heading>
          <Text>Create and manage posts.</Text>
        </div>
        <CreatePostButton />
      </Box>
      <InfiniteScroll
        dataLength={(data?.pages.length || 0) * LIMIT_ITEM}
        next={fetchNextPage}
        hasMore={hasNextPage as boolean}
        loader={<>Loading ...</>}
      >
        <CardWrapper>
          {data?.pages.map((page) => (
            <>
              {page.posts.map((post) => (
                <Card key={post.id} {...post} />
              ))}
            </>
          ))}
        </CardWrapper>
      </InfiniteScroll>
    </Layout>
  )
}

type cardProps = {
  id: string
  title: string
  slug: string
  createdAt: Date
  published: boolean
  author: any
}

const Card: FC<cardProps> = ({
  id,
  title,
  slug,
  createdAt,
  author,
  published,
}) => {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const tRpcUtils = api.useContext()

  const deletePostById = api.blog.deletePostById.useMutation({
    onMutate: async () => {
      await tRpcUtils.blog.getAllUserPost.cancel()

      const previousAllPost = tRpcUtils.blog.getAllUserPost.getInfiniteData({
        limit: LIMIT_ITEM,
      })

      tRpcUtils.blog.getAllUserPost.setInfiniteData(
        { limit: LIMIT_ITEM },
        (oldData: any) => {
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              posts: page.posts.filter((post: any) => post.id !== id),
            })),
          }
        },
      )

      return {
        previousAllPost,
      }
    },
    onError: (err, variables, context) => {
      tRpcUtils.blog.getAllUserPost.setInfiniteData(
        { limit: LIMIT_ITEM },
        { ...(context?.previousAllPost as any) },
      )
    },

    // Alway Refresh after success or error
    onSettled: () => {
      tRpcUtils.blog.getAllUserPost.refetch()
    },
    onSuccess: () => {
      setShowModal(false)
    },
  })

  const toggleShowModal = () => {
    setShowModal(!showModal)
  }

  const onConfirmDeletePost = async () => {
    await deletePostById.mutateAsync({
      postId: id,
    })
  }

  return (
    <>
      <CardStyled>
        <div>
          <Link href={`/${author?.login}/${slug}`}>
            <CardTitle>{title}</CardTitle>
          </Link>
          <CardDate>{dayjs(createdAt).format("MMM D, YYYY")}</CardDate>
        </div>
        <CardStatus published={published}>
          {published ? "Published" : "Draft"}
        </CardStatus>
        <Dropdown horizontal="left">
          <Dropdown.Toggle>
            <TbDotsVertical />
          </Dropdown.Toggle>
          <div>
            <Dropdown.Menu className="w-52">
              <Dropdown.Item
                onClick={() => router.push(`/${author?.login}/${slug}`)}
              >
                View
              </Dropdown.Item>
              <Dropdown.Item onClick={() => router.push(`/post/edit/${id}`)}>
                Edit
              </Dropdown.Item>
              <Dropdown.Item
                className="text-red-500"
                onClick={() => setShowModal(true)}
              >
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </div>
        </Dropdown>
      </CardStyled>

      {/* Modal */}
      <Modal open={showModal} onClickBackdrop={toggleShowModal}>
        <Modal.Body>
          <h1 className="mb-8 text-2xl text-center text-white">
            Are you sure you want to delete this Blog?
          </h1>
        </Modal.Body>
        <Modal.Actions>
          <Button onClick={toggleShowModal}>Cancel</Button>
          <Button
            loading={deletePostById.isLoading}
            onClick={onConfirmDeletePost}
            className="text-white bg-red-500"
          >
            Delete
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  )
}

const Box = tw.div`flex items-center justify-between gap-5 mb-8`
const Heading = tw.h1`text-white text-2xl`
const Text = tw.h1``
const CardWrapper = tw.div`flex flex-col gap-5`

const CardStyled = tw.div`flex items-center gap-5  justify-between py-5 px-6 border border-gray-400 border-opacity-50`
const CardTitle = tw.h2`text-white text-xl`
const CardDate = tw.p``
const CardStatus = styled.p(({ published }: { published: boolean }) => [
  tw`px-2 py-1 text-white rounded-md `,
  !published ? tw`bg-primary` : tw`bg-green-500`,
])
