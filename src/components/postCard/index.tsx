import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import styled from "@emotion/styled"
import { Button, Card, Tooltip } from "react-daisyui"
import { AiOutlineLike, AiTwotoneLike } from "react-icons/ai"
import { BiCommentDots } from "react-icons/bi"
import { GrView } from "react-icons/gr"
import tw from "twin.macro"

function PostCard() {
  const [isLike, setIsLike] = useState<boolean>(false)

  const onLikePost = () => {
    setIsLike(!isLike)
  }

  return (
    <Link href="/ataro-ga/hello-how-are-you">
      <CardWrapper>
        <Card.Image
          src="https://daily-now-res.cloudinary.com/image/upload/v1679306271/96835229db75693a44e598609fe73bbb.jpg"
          alt="Post"
        />
        <CardBody>
          <CardDate>April 4, 2023</CardDate>
          <CardTitle tag="h2">
            After internal 'panic', Google is rushing to unveil a new AI-powered
            search engine to compete with Microsoft{" "}
          </CardTitle>
          <CardActions>
            <CardAvatar
              src="https://i.pravatar.cc/300"
              height={60}
              width={60}
              alt="user avatar"
            />
            <CardRightAction>
              <Tooltip color="primary" message="View">
                <CardActionIcon>
                  <GrView size={18} tw="!stroke-gray-400" />
                  <span>12.6k</span>
                </CardActionIcon>
              </Tooltip>
              <Tooltip color="primary" message="Comment">
                <CardActionIcon tw="border-x border-gray-400 border-opacity-40 px-3">
                  <BiCommentDots size={18} />
                  <span>13</span>
                </CardActionIcon>
              </Tooltip>
              <Tooltip color="primary" message="Like">
                <CardActionIcon onClick={onLikePost}>
                  {isLike ? (
                    <AiTwotoneLike tw="text-primary" size={18} />
                  ) : (
                    <AiOutlineLike size={18} />
                  )}
                  <span>45</span>
                </CardActionIcon>
              </Tooltip>
            </CardRightAction>
          </CardActions>
        </CardBody>
      </CardWrapper>
    </Link>
  )
}

const CardWrapper = tw(
  Card,
)`border border-gray-700 hover:border-primary transition duration-500 ease-in-out cursor-pointer`
const CardTitle = tw(Card.Title)`line-clamp-3 text-white text-2xl mb-0`
const CardBody = tw(Card.Body)`px-6 pt-2`
const CardDate = tw.p`text-gray-400 text-opacity-80 text-xs`
const CardActions = tw(
  Card.Actions,
)`flex justify-between items-center gap-3 mt-4`
const CardAvatar = tw(Image)`rounded-full w-8 h-8`
const CardRightAction = tw.div`flex gap-2`
const CardActionIcon = styled.div`
  ${tw`text-gray-400 flex items-center gap-1 px-1`}
  
  & span {
    ${tw`text-gray-400 text-sm`}
  }
`

export default PostCard
