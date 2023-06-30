import { fileURLToPath } from "url"
import React, { ChangeEvent, useEffect, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { Cropper, CropperRef } from "react-advanced-cropper"
import { Button, FileInput, Modal } from "react-daisyui"

import { api } from "@/utils/api"
import useStore from "@/stores/useStore"
import { successAlert } from "../alert"
import CustomButton from "../ui/customButton"

interface props {
  currentImage: string
  login: string
}

const UploadUserPicture = ({ currentImage, login }: props) => {
  const [image, setImage] = useState<string>(currentImage)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const cropperRef = useRef<CropperRef>(null)

  const { data: session, update: sessionUpdate } = useSession()

  const { showPictureModal, setShowPictureModal } = useStore()

  const tRPCUtils = api.useContext()

  const updateUserPicture = api.user.updateUserPicture.useMutation({
    onSuccess: (newData) => {
      setShowPictureModal(false)
      successAlert("Picture Updated")
      //   Updated Picture from the user session image
      sessionUpdate({
        user: {
          image: newData.image,
        },
      })
    },
    onMutate: async (newData) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await tRPCUtils.user.getUserProfileByLogin.cancel({ login })
      // Snapshot the previous value
      const previousValue = tRPCUtils.user.getUserProfileByLogin.getData({
        login,
      })
      // Optimistically update to the new value
      if (previousValue) {
        tRPCUtils.user.getUserProfileByLogin.setData({ login }, () => {
          return {
            ...previousValue,
            image: newData.base64Image,
          }
        })
      }
      // Return a context object with the snapshotted value
      return { previousValue }
    },
    onError: (error, newData, context) => {
      tRPCUtils.user.getUserProfileByLogin.setData(
        { login },
        {
          ...(context?.previousValue as any),
        },
      )
    },
    onSettled: () => {
      tRPCUtils.user.getUserProfileByLogin.invalidate({ login })
    },
  })

  const onCrop = () => {
    const cropper = cropperRef.current
    if (cropper) {
      const canvas = cropper.getCanvas()
      //   Get the cropper in blog file
      const blob = canvas && canvas.toDataURL()
      updateUserPicture.mutate({
        base64Image: blob as string,
      })
    }
  }

  const onLoadImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0]
    if (file) {
      setImage(URL.createObjectURL(file))
    }
    event.target.value = ""
  }
  const onUpload = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  useEffect(() => {
    // Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
    return () => {
      if (image) {
        URL.revokeObjectURL(image)
      }
    }
  }, [image])

  return (
    <Modal open={showPictureModal}>
      <Button
        size="sm"
        shape="circle"
        className="absolute right-2 top-2"
        onClick={() => setShowPictureModal(false)}
      >
        ✕
      </Button>
      <Modal.Header>Change Profile Picture</Modal.Header>
      <Modal.Body>
        <FileInput
          type="file"
          ref={inputRef}
          className="hidden"
          onChange={onLoadImage}
          accept="image/*"
        />
        <Cropper
          src={image}
          ref={cropperRef}
          className={"cropper"}
          aspectRatio={() => 4 / 3}
          maxWidth={1080}
          maxHeight={1080}
        />
      </Modal.Body>
      <Modal.Actions className="grid grid-cols-2 items-center">
        <CustomButton onClick={onUpload}>Change</CustomButton>
        <CustomButton
          variants="primary"
          onClick={onCrop}
          loading={updateUserPicture.isLoading}
        >
          Save
        </CustomButton>
      </Modal.Actions>
    </Modal>
  )
}

export default UploadUserPicture
