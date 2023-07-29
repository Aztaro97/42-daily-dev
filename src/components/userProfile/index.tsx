import React, { FC } from "react"
import Image from "next/image"
import Link from "next/link"
import dayjs from "dayjs"
import { useSession } from "next-auth/react"
import { AiOutlineLink } from "react-icons/ai"
import { BiCamera } from "react-icons/bi"
import { FaFacebookSquare, FaGithub, FaTwitter } from "react-icons/fa"
import { MdOutlineDateRange } from "react-icons/md"
import Skeleton from "react-loading-skeleton"
import tw from "twin.macro"

import { api } from "@/utils/api"
import { IUser } from "@/@types/nextauth"
import { DefaultProfileImg } from "@/assets"
import useStore from "@/stores/useStore"
import CustomButton from "../ui/customButton"
import FollowButton from "../ui/followButton"

interface cardProfileProps extends IUser {
  followers: any[]
}

export default function UserProfile({
  email,
  bio,
  image,
  name,
  login,
  id,
  followers,
  _count,
  websiteUrl,
  twitterUrl,
  githubUrl,
  createdAt,
}: cardProfileProps) {
  const setFollowUser = api.follow.setFollowUser.useMutation()
  const { data: userSession } = useSession()
  const { setShowEditModal, setShowPictureModal } = useStore()

  //   Check if the user is following the profile user
  const isFollowing = followers.some((fol: any) => fol.followingId === id)

  return (
    <GridContainer>
      <PictureWrapper>
        <ProfileImage
          src={image ?? DefaultProfileImg.src}
          width={1000}
          height={1000}
          alt={name}
          priority
        />
        {userSession?.userId === id && (
          <CustomButton
            className="absolute top-2 right-2"
            onClick={() => setShowPictureModal(true)}
          >
            <BiCamera size={25} />
          </CustomButton>
        )}
      </PictureWrapper>
      <InfoWrapper>
        <InfoHeading>
          <InfoUserName>{name}</InfoUserName>
          {userSession?.userId === id ? (
            <CustomButton
              onClick={() => setShowEditModal(true)}
              variants="primary"
              className="tracking-wider"
            >
              Edit Profile
            </CustomButton>
          ) : (
            <FollowButton
              login={login}
              followingId={id as string}
              isFollowing={isFollowing}
            />
          )}
        </InfoHeading>
        <div className="flex items-center space-x-2">
          <p className="text-primary text-opacity-90">{`@${login}`}</p>{" "}
          <span>|</span>
          <InfoDateJoined>
            <MdOutlineDateRange size={18} />
            <span>Joined on {dayjs(createdAt).format("MMMM DD, YYYY")}</span>
          </InfoDateJoined>
        </div>

        <FollowersBox>
          <FollowerGroup>
            <FollowerItem>
              <span className="mr-1 font-bold">{_count.posts}</span>Posts
            </FollowerItem>
          </FollowerGroup>
          <FollowerGroup>
            <FollowerItem>
              <span className="mr-1 font-bold">{_count.followers}</span>
              Followers
            </FollowerItem>
          </FollowerGroup>
          <FollowerGroup>
            <FollowerItem>
              <span className="mr-1 font-bold">{_count.following}</span>
              Following
            </FollowerItem>
          </FollowerGroup>
        </FollowersBox>

        {/* BIO description */}
        {bio && <p className="p-4 mb-5 border-l border-primary">{bio}</p>}

        {/* Socila Media */}
        <div className="flex items-center space-x-5">
          {websiteUrl && (
            <SocialLink href={websiteUrl} target="_blank">
              <AiOutlineLink size={25} />
              <span>{websiteUrl}</span>
            </SocialLink>
          )}

          {githubUrl && (
            <SocialLink href={githubUrl} target="_blank">
              <FaGithub size={25} />
            </SocialLink>
          )}
          {twitterUrl && (
            <SocialLink href={twitterUrl} target="_blank">
              <FaTwitter size={25} />
            </SocialLink>
          )}
        </div>
      </InfoWrapper>
    </GridContainer>
  )
}

UserProfile.Skeleton = function UserProfileSkeleton() {
  return (
    <GridContainer>
      <Skeleton height={300} className="w-full" />
      <InfoWrapper>
        <InfoHeading>
          <Skeleton height={30} width={200} />
          <Skeleton height={30} width={100} />
        </InfoHeading>
        <div className="flex items-center space-x-2">
          <Skeleton width={170} />
        </div>

        <FollowersBox>
          <Skeleton width={80} />
          <Skeleton width={80} />
          <Skeleton width={80} />
        </FollowersBox>

        {/* BIO description */}
        <Skeleton className="w-full" count={5} />
        {/* Socila Media */}
        <div className="flex items-center space-x-5">
          <Skeleton width={120} />
          <Skeleton width={30} height={30} circle />
          <Skeleton width={30} height={30} circle />
        </div>
      </InfoWrapper>
    </GridContainer>
  )
}

const GridContainer = tw.div`grid items-start justify-center max-w-4xl grid-cols-1 gap-10 mx-auto lg:grid-cols-2`
const PictureWrapper = tw.figure`relative max-w-xl`
const ProfileImage = tw(
  Image,
)`max-w-[600px] w-full h-[300px] object-cover object-center rounded-md`
const InfoWrapper = tw.div`h-full space-y-5`
const InfoHeading = tw.div`flex items-center justify-between gap-5`
const InfoUserName = tw.h2`mb-1 text-3xl`
const FollowersBox = tw.div`flex items-center justify-start gap-5`
const FollowerGroup = tw.div`space-x-2`
const FollowerItem = tw.p`text-lg`
const InfoDateJoined = tw.div`flex items-center space-x-1 duration-300 ease-in-out hover:text-primary`
const SocialLink = tw(
  Link,
)`flex items-center space-x-1 duration-300 ease-in-out hover:text-primary`
