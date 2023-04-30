import React from "react"
import Image from "next/image"
import { FiUploadCloud } from "react-icons/fi"
import ImageUploading, { ImageListType } from "react-images-uploading"

interface props {
  onChangeImage: (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined,
  ) => void
  value: ImageListType
}

export const DATA_COVER_IMAGE_URL_KEY = "image_url" as string

const CoverImageUploader = ({ onChangeImage, value, ...rest }: props) => {
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
                  <div
                    key={index}
                    className="flex items-center justify-start w-full h-full"
                  >
                    <Image
                      src={image[DATA_COVER_IMAGE_URL_KEY]}
                      alt=""
                      width={900}
                      height={500}
                      className="max-h-[300px] mr-auto  my-0 object-contain object-center"
                    />
                    <div className="z-10 flex items-start justify-start gap-2">
                      <button
                        onClick={() => onImageUpdate(index)}
                        className="px-3 py-1 text-black bg-green-500 rounded-sm"
                      >
                        Change
                      </button>
                      <button
                        onClick={() => onImageRemove(index)}
                        className="px-3 py-1 text-black bg-red-500 rounded-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )
      }}
    </ImageUploading>
  )
}

export default CoverImageUploader
