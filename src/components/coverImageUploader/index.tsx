import React from "react"
import Image from "next/image"
import { FiUploadCloud } from "react-icons/fi"
import ImageUploading, { ImageListType } from "react-images-uploading"

interface props {
  onChangeImage: (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined,
  ) => void;
  value: ImageListType;
}

export const DATA_COVER_IMAGE_URL_KEY= "image_url"

const CoverImageUploader = ({ onChangeImage,value, ...rest }: props) => {
  return (
    <ImageUploading
	{...rest}
      onChange={onChangeImage}
      maxNumber={1}
	  value={value}
      dataURLKey={DATA_COVER_IMAGE_URL_KEY}
	  acceptType={['jpg', 'gif', 'png', "jpeg"]}
    >
      {({
        imageList,
        onImageUpload,
        onImageRemoveAll,
        onImageUpdate,
        onImageRemove,
        isDragging,
        dragProps,
      }) => {
		return (
			<div className="min-h-16 relative flex items-center justify-center">
          {!imageList.length ? (
            <div
              style={isDragging ? { color: "red" } : undefined}
              className="w-full h-full flex items-center justify-center flex-col gap-2 py-5 cursor-pointer border border-primary rounded-md"
              onClick={onImageUpload}
              {...dragProps}
            >
              <h2 className="text-3xl font-medium m-0">Add a cover image</h2>
              <FiUploadCloud size={40} />
              <p className="m-0">Upload or Drag & Drop</p>
            </div>
          ) : (
            <>
              {imageList.map((image, index) => (
                <div
                  key={index}
                  className="w-full h-full flex items-center justify-start"
                >
                  <Image
                    src={image[DATA_COVER_IMAGE_URL_KEY]}
                    alt=""
                    width={900}
                    height={500}
                    className="max-h-[300px] mr-auto  my-0 object-contain object-center"
                  />
                  <div className="flex items-start justify-start gap-2 z-10">
                    <button
                      onClick={() => onImageUpdate(index)}
                      className="bg-green-500 px-3 py-1 text-black rounded-sm"
                    >
                      Change
                    </button>
                    <button
                      onClick={() => onImageRemove(index)}
                      className="bg-red-500 px-3 py-1 text-black rounded-sm"
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
