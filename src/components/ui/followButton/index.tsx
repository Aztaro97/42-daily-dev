import React, { FC, useCallback } from "react"
import { useSession } from "next-auth/react"

import { api } from "@/utils/api"
import { infoAlert } from "@/components/alert"
import useStore from "@/stores/useStore"
import CustomButton from "../customButton"

interface props {
  readonly followingId: string
  isFollowing: boolean
  login: string
}

const FollowButton: FC<props> = ({ followingId, isFollowing, login }) => {
  const tRpcUtils = api.useContext()

  const { data: userSession } = useSession()
  const { setShowModal } = useStore()

  const setFollowUser = api.follow.setFollowUser.useMutation({
    onMutate: async ({ followingId }) => {
      await tRpcUtils.user.getUserProfileByLogin.cancel()

      const previousUserProfile = tRpcUtils.user.getUserProfileByLogin.getData({
        login,
      })

      //   Optimize
      // Update the follow status
      tRpcUtils.user.getUserProfileByLogin.setData(
        {
          login,
        },
        (oldData: any) => {
          return {
            ...oldData,
            followers: oldData.followers.concat({
              followingId: followingId,
            }),
            _count: {
              ...oldData._count,
              followers: oldData._count.followers + 1,
            },
          }
        },
      )

      return {
        previousUserProfile,
      }
    },

    onError: (error, newData, context) => {
      tRpcUtils.user.getUserProfileByLogin.setData(
        { login },
        {
          ...(context?.previousUserProfile as any),
        },
      )
    },

    // Alway Refresh after success or error
    onSettled: () => {
      tRpcUtils.user.getUserProfileByLogin.invalidate({ login })
    },
    onSuccess: (data) => {
      console.log(data)
    },
  })

  const deleteFollowUser = api.follow.deleteFollowUser.useMutation({
    onMutate: async ({ followingId }) => {
      await tRpcUtils.user.getUserProfileByLogin.cancel()

      const previousUserProfile = tRpcUtils.user.getUserProfileByLogin.getData({
        login,
      })

      tRpcUtils.user.getUserProfileByLogin.setData(
        { login },
        (oldData: any) => {
          return {
            ...oldData,
            followers: oldData.followers.filter(
              (follower: any) => follower.followingId !== followingId,
            ),
            _count: {
              ...oldData._count,
              followers: oldData._count.followers - 1,
            },
          }
        },
      )

      return {
        previousUserProfile,
      }
    },

    onError: (error, newData, context) => {
      tRpcUtils.user.getUserProfileByLogin.setData(
        { login },
        {
          ...(context?.previousUserProfile as any),
        },
      )
    },

    onSettled: () => {
      tRpcUtils.user.getUserProfileByLogin.invalidate({ login })
    },
    onSuccess: (data) => {
      console.log(data)
    },
  })

  const onFollowUser = useCallback(() => {
    if (!userSession) {
      infoAlert("You should login")
    }
    if (userSession && userSession.userId) {
      setFollowUser.mutate({ followingId })
    }
  }, [userSession, followingId, setFollowUser])

  const onUnFollowUser = useCallback(() => {
    if (!userSession) {
      infoAlert("You should login")
    }
    if (userSession && userSession.userId) {
      deleteFollowUser.mutate({ followingId })
    }
  }, [userSession, followingId, deleteFollowUser])

  return (
    <>
      {!isFollowing ? (
        <CustomButton onClick={onFollowUser} variants="primary">
          follow
        </CustomButton>
      ) : (
        <CustomButton
          tw="bg-transparent"
          onClick={onUnFollowUser}
          variants="primary"
        >
          unfollow
        </CustomButton>
      )}
    </>
  )
}

export default FollowButton
