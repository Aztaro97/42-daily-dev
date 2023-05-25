import React, { useEffect, useState } from "react"
import Image from "next/image"
import { AiOutlineDelete } from "react-icons/ai"
import { FiUploadCloud } from "react-icons/fi"
import ImageUploading, { ImageListType } from "react-images-uploading"
import tw from "twin.macro"

import { api } from "@/utils/api"

interface props {
  postId: string
  imageUrl: string
}

export const DATA_COVER_IMAGE_URL_KEY = "image_url" as string

const CoverImageUploader = ({ imageUrl, postId, ...rest }: props) => {
  const [imageUpload, setImageUpload] = useState<ImageListType>([])
  const [imgUrl, setImgUrl] = useState<string>("")

  const { mutate: uploadImage, isLoading: uploading } =
    api.upload.uploadPostImage.useMutation()

  const { mutate: destroyImage, isLoading: destroying } =
    api.upload.destroyPostImage.useMutation()

  const onChangeImage = (imageList: ImageListType) => {
    setImageUpload(imageList)
    if (imageList.length) {
      uploadImage({ files: imageList, postId })
    }
  }

  const handleDestroyImage = () => {
    destroyImage({ postId })
  }

  useEffect(() => {
    if (imageUrl) {
      setImgUrl(imageUrl)
    }
  }, [imageUrl])

  return (
    <ImageUploading
      {...rest}
      onChange={onChangeImage}
      maxNumber={1}
      value={imageUpload}
      dataURLKey={DATA_COVER_IMAGE_URL_KEY}
      acceptType={["jpg", "gif", "png", "jpeg"]}
    >
      {({
        imageList,
        onImageUpload,
        onImageUpdate,
        onImageRemove,
        isDragging,
        dragProps,
      }) => {
        return (
          <div className="relative flex items-center justify-center min-h-16">
            {imgUrl ? (
              <>
                {
                  <ImageWrapper>
                    <ImageStyled src={imgUrl} alt="" width={900} height={500} priority />
                    <DeleteBtn
                      onClick={() => {
                        setImgUrl("")
                        destroyImage({ postId })
                      }}
                    >
                      <AiOutlineDelete size={20} />
                    </DeleteBtn>
                  </ImageWrapper>
                }
              </>
            ) : (
              <>
                {!imageList.length ? (
                  <div
                    style={isDragging ? { color: "red" } : undefined}
                    className="flex flex-col items-center justify-center w-full h-full gap-2 py-5 border rounded-md cursor-pointer border-primary"
                    onClick={onImageUpload}
                    {...dragProps}
                  >
                    <h2 className="m-0 text-3xl font-medium">
                      Add a cover image
                    </h2>
                    <FiUploadCloud size={40} />
                    <p className="m-0">Upload or Drag & Drop</p>
                  </div>
                ) : (
                  <>
                    {imageList.map((image, index) => (
                      <Box key={index}>
                        <ImageWrapper>
                          <ImageStyled
                            src={image[DATA_COVER_IMAGE_URL_KEY]}
                            alt=""
                            width={900}
                            height={500}
                          />
                          <DeleteBtn
                            onClick={() => {
                              onImageRemove(index)
                              destroyImage({ postId })
                            }}
                          >
                            <AiOutlineDelete size={20} />
                          </DeleteBtn>
                        </ImageWrapper>
                      </Box>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        )
      }}
    </ImageUploading>
  )
}

const Box = tw.div`flex items-center justify-center`
const ImageWrapper = tw.div`relative`
const DeleteBtn = tw.button`absolute -top-3 -right-3 z-10 bg-secondary rounded-full flex items-center justify-center w-8 h-8 outline-none border-none text-black hover:scale-110 hover:animate-pulse duration-300 transition-all ease-in-out`
const ImageStyled = tw(Image)`max-h-[200px] w-auto object-contain object-center`

export default CoverImageUploader
