import React, { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import EditorJS, { EditorConfig } from "@editorjs/editorjs"
import styled from "@emotion/styled"
import { zodResolver } from "@hookform/resolvers/zod"
import { Divider } from "react-daisyui"
import { Controller, useForm } from "react-hook-form"
import { FiUploadCloud } from "react-icons/fi"
import ImageUploading, { ImageListType } from "react-images-uploading"
import TextareaAutosize from "react-textarea-autosize"
import tw from "twin.macro"
import { z } from "zod"

import { api } from "@/utils/api"
import { convertToBase64 } from "@/utils/utils"
import CustomButton from "@/components/ui/customButton"
import { postSchema } from "@/schema/postSchema"
import SelectInput from "../ui/SelectInput"

interface editorProps {
  post: z.infer<typeof postSchema>
}

type FormData = z.infer<typeof postSchema>

const EDITOR_HOLDER_ID = "editorJs"

export default function Editor({ post }: editorProps) {
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const [imageFile, setImageFile] = useState<ImageListType>([])
  const ref = useRef<EditorJS>()

  let allImageUploaded: string[] = []

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      id: post.id,
      tags: post.tags,
      published: post.published,
    },
  })

  const uploadEditorImage = api.blog.uploadEditorImage.useMutation()
  const deleteEditorImage = api.blog.deleteEditorImage.useMutation()
  const createPost = api.blog.createPost.useMutation()

  const onChangeImage = (
    imageList: ImageListType,
    addUpdateIndex: number[],
  ) => {
    console.log(imageList, addUpdateIndex)
    setImageFile(imageList)
  }

  const handleChange = () => {
    const currentImages: string[] = []

    document.querySelectorAll(".image-tool__image-picture").forEach((x) => {
      const path = x.src.match(/\/*.*$/g)[0]
      currentImages.push(path)
    })

    if (allImageUploaded.length > currentImages.length) {
      allImageUploaded.forEach(async (img) => {
        if (!currentImages.includes(img)) {
          const url = new URL(img)
          const public_id = url.pathname.split("/").pop().split(".")[0]
          console.log(public_id)
          // Mutate to remove img from server
          await deleteEditorImage.mutateAsync({ public_id })

          // if success, remove from allImageUploaded
          let filterImage = allImageUploaded.filter((x) => x != img)
          allImageUploaded = filterImage
        }
      })
    }
  }

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default
    const Header = (await import("@editorjs/header")).default
    const Embed = (await import("@editorjs/embed")).default
    const Table = (await import("@editorjs/table")).default
    const List = (await import("@editorjs/list")).default
    // const Code = (await import("@editorjs/code")).default
    const CodeFlask = (await import("@calumk/editorjs-codeflask")).default
    const LinkTool = (await import("@editorjs/link")).default
    const InlineCode = (await import("@editorjs/inline-code")).default
    const Quote = (await import("@editorjs/quote")).default
    const Marker = (await import("@editorjs/marker")).default
    const Delimiter = (await import("@editorjs/marker")).default
    const Checklist = (await import("@editorjs/checklist")).default
    const ImageTool = (await import("@editorjs/image")).default
    const simpleImage = (await import("@editorjs/simple-image")).default
    const Paragraph = (await import("@editorjs/paragraph")).default
    const Underline = (await import("@editorjs/underline")).default
    const RawTool = (await import("@editorjs/raw")).default
    const Warning = (await import("@editorjs/warning")).default
    const AlignmentTuneTool = (
      await import("editorjs-text-alignment-blocktune")
    ).default
    const DragDrop = (await import("editorjs-drag-drop")).default
    const Undo = (await import("editorjs-undo")).default

    const body = postSchema.parse(post)

    if (!ref.current) {
      const editor = new EditorJS({
        holder: EDITOR_HOLDER_ID,
        onChange: handleChange,
        onReady() {
          ref.current = editor
          new Undo({ editor })
          new DragDrop(editor)
        },
        data: body.content,
        placeholder: "Type Your Content Here...",
        inlineToolbar: true,
        tools: {
          header: {
            class: Header,
            inlineToolbar: ["link"],
            config: {
              placeholder: "Header",
            },
            shortcut: "CMD+SHIFT+H",
            tunes: ["textAlignment"],
          },
          list: {
            class: List,
            inlineToolbar: true,
            shortcut: "CMD+SHIFT+L",
            tunes: ["textAlignment"],
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
            config: {
              quotePlaceholder: "Enter a quote",
              captionPlaceholder: "Quote's author",
            },
            shortcut: "CMD+SHIFT+O",
          },
          marker: {
            class: Marker,
            shortcut: "CMD+SHIFT+M",
          },
          code: {
            class: CodeFlask,
            inlineToolbar: true,
          },
          delimiter: Delimiter,
          inlineCode: {
            class: InlineCode,
            shortcut: "CMD+SHIFT+C",
          },
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "http://localhost:8000/fetchUrl", // Your backend endpoint for url data fetching
            },
          },
          embed: {
            class: Embed,
            config: {
              services: {
                youtube: true,
                coub: true,
              },
            },
          },
          table: {
            class: Table,
            inlineToolbar: true,
            shortcut: "CMD+ALT+T",
          },
          warning: Warning,
          checklist: {
            class: Checklist,
            inlineToolbar: true,
          },
          raw: RawTool,
          image: {
            class: ImageTool,
            config: {
              field: "image",
              types: "image/*",
              uploader: {
                uploadByFile: async (imageFile: File) => {
                  const file = await convertToBase64(imageFile)
                  const result = await uploadEditorImage.mutateAsync({ file })
                  // keep track of images, add the url of each new image to our array
                  allImageUploaded.push(result.url)
                  console.log("result.url", result.url)
                  return {
                    success: 1,
                    file: {
                      url: result.url,
                    },
                  }
                },
              },
            },
          },
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
            tunes: ["textAlignment"],
          },
          underline: Underline,
          textAlignment: {
            class: AlignmentTuneTool,
            config: {
              default: "left",
              blocks: ["paragraph", "header", "list"],
            },
          },
        },
      })
    }
  }, [post])

  const onSubmit = async (formData) => {
    const blockContent = await ref.current?.save()
    console.log("formData", formData)
    createPost.mutate({
      id: formData.id,
      title: formData.title,
      tags: formData.tags,
      published: formData.published,
      content: blockContent,
    })
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true)
    }
  }, [])

  useEffect(() => {
    if (isMounted) {
      initializeEditor()
    }
    return () => {
      ref.current?.destroy()
      ref.current = undefined
    }
  }, [isMounted, initializeEditor])

  if (!isMounted) {
    return null
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="prose-stone prose mx-auto w-full max-w-[900px]">
        <InputImageUploader
          onChangeImage={onChangeImage}
          imageFile={imageFile}
        />
        <Divider className="my-2" />
        <TextareaAutosize
          autoFocus
          id="title"
          defaultValue={post.title}
          placeholder="New Post title here..."
          className="w-full resize-none appearance-none overflow-hidden text-5xl font-bold focus:outline-none px-3 py-1 bg-transparent mt-6"
          {...register("title")}
        />

        <Controller
          name="tags"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <SelectInput
              defaultValue={post.tags}
              onBlur={onBlur}
              onChange={onChange}
              value={value}
            />
          )}
        />
        <Divider className="my-2" />
        <EditorBox
          id={EDITOR_HOLDER_ID}
          className={"w-full min-h-[80px] mb-5"}
        ></EditorBox>
        <ActionButtonWrapper>
          <button type="submit">Publish</button>
          <CustomButton>Save draft</CustomButton>
        </ActionButtonWrapper>
      </div>
    </form>
  )
}

const InputImageUploader = ({
  onChangeImage,
  imageFile,
}: {
  onChangeImage: (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined,
  ) => void
  imageFile: ImageListType
}) => {
  return (
    <ImageUploading
      multiple
      value={imageFile}
      onChange={onChangeImage}
      maxNumber={1}
      dataURLKey="data_url"
    >
      {({
        imageList,
        onImageUpload,
        onImageRemoveAll,
        onImageUpdate,
        onImageRemove,
        isDragging,
        dragProps,
      }) => (
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
                    src={image["data_url"]}
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
      )}
    </ImageUploading>
  )
}

const ActionButtonWrapper = tw.div`flex justify-end items-center gap-3`
const EditorBox = styled.div`
  & .ce-block__content {
    /* ${tw`mx-0 ml-4`} */
  }

  & .ce-popover--opened {
    ${tw`z-50 bg-slate-900 border border-white border-opacity-40`}

    & .cdx-search-field {
      ${tw`bg-transparent`}
    }

    & .ce-popover__item-icon {
      ${tw`bg-transparent`}
    }

    & .ce-popover__item:hover {
      ${tw`bg-primary text-white`}
    }
  }

  & .ce-block--selected .ce-block__content {
    ${tw`bg-blue-900`}
  }

  & .ce-toolbar__plus,
  & .ce-toolbar__settings-btn {
    ${tw`bg-primary text-white`}
  }
`
