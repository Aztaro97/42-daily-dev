import React, { FC } from "react"
import tw from "twin.macro"

import { api } from "@/utils/api"
import { IUser } from "@/@types/nextauth"
import CommentCard from "./commentCard"
import CommentForm from "./commentForm"

interface commenterProps {
  id: string
  content: string
  author: IUser
}

interface props {
  postId: string
  commentRef: React.RefObject<HTMLDivElement>
}

const CommentField: FC<props> = ({ postId, commentRef }) => {
  const { data: commentData, isLoading } =
    api.comment.getCommentsByPostId.useQuery(
      { postId },
      {
        enabled: !!postId,
      },
    )

  return (
    <div ref={commentRef}>
      <CommentForm postId={postId} />
      {isLoading ? (
        <h2>Loading...</h2>
      ) : (
        <>
          {commentData && commentData?.length > 0 ? (
            <CommentsBox>
              {commentData.map((comment: any) => (
                <CommentCard key={comment.id} {...comment} postId={postId} />
              ))}
            </CommentsBox>
          ) : null}
        </>
      )}
    </div>
  )
}

const CommentsBox = tw.div`flex flex-col gap-4 my-5`

export default CommentField
