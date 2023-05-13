import React from "react"
import Image from "next/image"
import { AiOutlineDelete } from "react-icons/ai"
import { FiUploadCloud } from "react-icons/fi"
import ImageUploading, { ImageListType } from "react-images-uploading"
import tw from "twin.macro"

interface props {
  onChangeImage: (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined,
  ) => void
  value: ImageListType
  imageUrl: string
}

export const DATA_COVER_IMAGE_URL_KEY = "image_url" as string

const CoverImageUploader = ({
  onChangeImage,
  value,
  imageUrl,
  ...rest
}: props) => {
  const ExistingImage = () => (
    <Image
      src={imageUrl}
      alt=""
      width={900}
      height={500}
      className="max-h-[300px] mr-auto  my-0 object-contain object-center"
    />
  )

  return (
    <ImageUploading
      {...rest}
      onChange={onChangeImage}
      maxNumber={1}
      value={value}
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
            {!imageList.length ? (
              <div
                style={isDragging ? { color: "red" } : undefined}
                className="flex flex-col items-center justify-center w-full h-full gap-2 py-5 border rounded-md cursor-pointer border-primary"
                onClick={onImageUpload}
                {...dragProps}
              >
                <h2 className="m-0 text-3xl font-medium">Add a cover image</h2>
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
                      <DeleteBtn onClick={() => onImageRemove(index)}>
                        <AiOutlineDelete size={20} />
                      </DeleteBtn>
                    </ImageWrapper>
                  </Box>
                ))}
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
