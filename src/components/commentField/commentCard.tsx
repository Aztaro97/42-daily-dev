import React, { FC, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { useSession } from "next-auth/react"
import { Button, Dropdown, Modal } from "react-daisyui"
import { TbDotsVertical } from "react-icons/tb"
import tw from "twin.macro"

import { api } from "@/utils/api"
import { IUser } from "@/@types/nextauth"
import { successAlert } from "../alert"
import MdRendering from "../mdRendering"

dayjs.extend(relativeTime)

export interface commenterProps {
  id: string
  content: string
  author: IUser
  createdAt: Date
  postId: string
}

const CommentCard: FC<commenterProps> = ({
  id,
  content,
  author,
  createdAt,
  postId,
}) => {
  const [showModal, setShowModal] = useState(false)

  const tRpcUtils = api.useContext()
  const router = useRouter()

  const deleteComment = api.comment.deleteComment.useMutation({
    onMutate: async () => {
      await tRpcUtils.comment.getCommentsByPostId.cancel({ postId })

      const previousComments = tRpcUtils.comment.getCommentsByPostId.getData({
        postId,
      })

      tRpcUtils.comment.getCommentsByPostId.setData(
        { postId },
        (oldData: any) => {
          return oldData.filter((comment: any) => comment.id !== id)
        },
      )

      return { previousComments }
    },
    // If the mutate fails
    // We'll use the context to returned from onMutate to roll back
    onError: (error, newDate, context) => {
      tRpcUtils.comment.getCommentsByPostId.setData(
        { postId },
        {
          ...(context?.previousComments as any),
        },
      )
    },
    // Alway Refresh after success or error
    onSettled: () => {
      tRpcUtils.comment.getCommentsByPostId.invalidate({ postId })
    },
    onSuccess: () => {
      successAlert("Commenter Delete")
    },
  })

  const { data: sessionData } = useSession()

  const toggleShowModal = () => {
    setShowModal(!showModal)
  }

  const handleDelete = async () => {
    await deleteComment.mutateAsync({ commentId: id })
    setShowModal(false)
  }

  return (
    <>
      <Container>
        <Link href={`/${author.login}`}>
          <ProfilePicture
            src={author.image ?? ""}
            width={140}
            height={140}
            alt={author.name}
          />
        </Link>
        <CommentBox>
          <CommentHeader>
            <CommentHeaderLeft>
              <Link href={`/${author.login}`}>
                <CommentAuthor>{author.name}</CommentAuthor>
              </Link>
              <span>-</span>
              <CommentDate>{dayjs().to(dayjs(createdAt))}</CommentDate>
            </CommentHeaderLeft>
            <CommentHeaderRight>
              <Dropdown horizontal="left">
                <Dropdown.Toggle>
                  <TbDotsVertical />
                </Dropdown.Toggle>
                <div>
                  <Dropdown.Menu className="w-52">
                    <Dropdown.Item
                      onClick={() => router.push(`/comment/edit/`)}
                    >
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
            </CommentHeaderRight>
          </CommentHeader>
          <CommentContent>
            <MdRendering data={content} />
          </CommentContent>
        </CommentBox>
      </Container>
      <Modal open={showModal} onClickBackdrop={toggleShowModal}>
        <Modal.Body>
          <h1 className="mb-8 text-2xl text-center text-white">
            Are you sure you want to delete this Blog?
          </h1>
        </Modal.Body>
        <Modal.Actions>
          <Button onClick={toggleShowModal}>Cancel</Button>
          <Button
            loading={deleteComment.isLoading}
            className="text-white bg-red-500"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  )
}

const Container = tw.div`flex gap-2 w-full`
const ProfilePicture = tw(
  Image,
)`w-10 h-10 rounded-full object-cover object-center`
const CommentBox = tw.div`border border-gray-400 border-opacity-50 rounded-md p-3 w-full`
const CommentHeader = tw.div`flex items-center justify-between gap-3 mb-3`
const CommentHeaderLeft = tw.div`flex items-center gap-3`
const CommentHeaderRight = tw.div``
const CommentAuthor = tw.p`text-white`
const CommentDate = tw.span`text-gray-400`
const CommentContent = tw.div`prose lg:prose-lg`

export default CommentCard
