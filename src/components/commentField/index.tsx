import React from "react"
import { useSession } from "next-auth/react"
import { Avatar } from "react-daisyui"

const CommentField = () => {
  return (
    <div>
      <FormField />
      <CommentCard />
      <CommentCard />
      <CommentCard />
      <CommentCard />
      <CommentCard />
    </div>
  )
}

const FormField = () => {
  const { data } = useSession()

  return (
    <form action="">
      <div className="flex flex-col gap-3">
        <Avatar src="" />
      </div>
      <div>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" />
      </div>
    </form>
  )
}

const CommentCard = () => {
  return <div>hello word</div>
}

export default CommentField
