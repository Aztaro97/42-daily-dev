import React, { FC, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import styled from "@emotion/styled"
import dayjs from "dayjs"
import { Button, Dropdown, Modal } from "react-daisyui"
import { TbDotsVertical } from "react-icons/tb"
import Skeleton from "react-loading-skeleton"
import tw from "twin.macro"

import { api } from "@/utils/api"

type cardProps = {
  id: string
  title: string
  slug: string
  createdAt: Date
  published: boolean
  author: any
}

const LIMIT_ITEM: number = 8

export default function PostCardTwo({
  id,
  title,
  slug,
  createdAt,
  author,
  published,
}: cardProps) {
  const router = useRouter()
  const [showModal, setShowModal] = useState<boolean>(false)
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
        <Dropdown horizontal="left" className="ml-auto">
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

PostCardTwo.Skeleton = function PostCardTwoSkeleton() {
  return (
    <CardStyled>
      <div>
        <Skeleton className="w-full" height={20} />
        <Skeleton width={100} height={10} />
      </div>
      <div className="flex items-center justify-center">
        <Skeleton width={70} height={20} />
      </div>
      <div className="ml-auto">
        <Skeleton width={50} height={20} />
      </div>
    </CardStyled>
  )
}

const CardStyled = tw.div`grid grid-cols-[2fr_1fr_1fr] items-center gap-5  justify-between py-5 px-6 border border-gray-400 border-opacity-50`
const CardTitle = tw.h2`text-white text-xl`
const CardDate = tw.p``
const CardStatus = styled.p(({ published }: { published: boolean }) => [
  tw`px-2 py-1 mx-auto text-white rounded-md`,
  !published ? tw`bg-primary` : tw`bg-green-500`,
])
