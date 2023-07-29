import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import styled from "@emotion/styled"
import { Avatar, Button, Card, Tooltip } from "react-daisyui"
import { AiOutlineLike, AiTwotoneLike } from "react-icons/ai"
import { BiCommentDots } from "react-icons/bi"
import { FaHeadphones } from "react-icons/fa"
import tw from "twin.macro"

function PodCastCard() {
  const [isLike, setIsLike] = useState<boolean>(false)

  const onLikePost = () => {
    setIsLike(!isLike)
  }

  return (
    <Link href="/podcast/hello-how-are-you">
      <CardWrapper>
        <Card.Image
          src="https://daily-now-res.cloudinary.com/image/upload/v1679306271/96835229db75693a44e598609fe73bbb.jpg"
          alt="Post"
        />
        <CardBody>
          <CardTitle tag="h2">
            After internal 'panic', Google is rushing
          </CardTitle>

          <Box>
            <RecordTime>
              <FaHeadphones size={18} />
              <span>23:12</span>
            </RecordTime>
            <PublishDate>April 4, 2023</PublishDate>
          </Box>

          <CardActions>
            <AvatarGroup>
              <AvatarStyled src="https://i.pravatar.cc/300" size={"xs"} />
              <AvatarStyled src="https://i.pravatar.cc/300" size={"xs"} />
              <AvatarStyled src="https://i.pravatar.cc/300" size={"xs"} />
            </AvatarGroup>
            <CardRightAction>
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
)`flex flex-col gap-1 border border-gray-700 hover:border-primary transition duration-500 ease-in-out cursor-pointer`
const CardTitle = tw(Card.Title)`line-clamp-3 text-white text-2xl mb-0`
const CardBody = tw(Card.Body)`px-6 pt-2 w-full`
const PublishDate = tw.p`flex-grow-0 text-gray-400 text-opacity-80 text-xs inline`
const CardActions = tw(
  Card.Actions,
)`flex justify-between items-center gap-3 mt-4`
const CardRightAction = tw.div`flex gap-2`
const CardActionIcon = styled.div`
  ${tw`flex items-center gap-1 px-1 text-gray-400`}

  & span {
    ${tw`text-sm text-gray-400`}
  }
`
const AvatarStyled = tw(Avatar)`w-8 h-8`
const AvatarGroup = tw(Avatar.Group)``
const Box = tw.div`flex items-center justify-between w-full gap-2`
const RecordTime = tw.div`flex gap-2 items-center text-xs`

export default PodCastCard
