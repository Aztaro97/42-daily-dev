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
import CoverImageUploader from "../coverImageUploader"
import SelectInput from "../ui/SelectInput"
import { DATA_COVER_IMAGE_URL_KEY } from "@/components/coverImageUploader"
import { successAlert } from "../alert"

interface editorProps {
  post: z.infer<typeof postSchema>
}

type FormData = z.infer<typeof postSchema>

const EDITOR_HOLDER_ID = "editorJs"

export default function Editor({ post }: editorProps) {
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const [isPublished, setIsPublished] = useState<boolean>(false)
  const [imageFile, setImageFile] = useState<ImageListType>([])
  const ref = useRef<EditorJS>()

  let allImageUploaded: string[] = []

  const {
    register,
    handleSubmit,
    control,
	getValues,
    formState: { errors,  },
  } = useForm<FormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      id: post.id,
      coverImage: post.coverImage || [],
      tags: post.tags,
      published: post.published,
    },
  })

  const uploadEditorImage = api.blog.uploadEditorImage.useMutation()
  const deleteEditorImage = api.blog.deleteEditorImage.useMutation()
  const createPost = api.blog.createPost.useMutation()

  const onChangeImage = (imageList: ImageListType) => {
    console.log(imageList)
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
                uploadByFile: async (fileImg: File) => {
                  const file = await convertToBase64(fileImg)
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
    const response = await createPost.mutateAsync({
		id: formData.id,
		title: formData.title,
		tags: formData.tags,
		published: formData.published,
		coverImage: getValues(`coverImage[0][${DATA_COVER_IMAGE_URL_KEY}]`),
		content: blockContent,
	  })
	  if (response) {
		console.log("response", response)
		successAlert("Post Published")
	  }
  }

  const onPublish = () => {
	console.log(" on onPublish")
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
        <Controller
          name="coverImage"
          control={control}
          render={({ field: { onChange, value } }) => (
            <CoverImageUploader onChangeImage={onChange} value={value} />
          )}
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
          <CustomButton  bgColor="primary" type="submit" loading={createPost.isLoading} onClick={onPublish}>Publish</CustomButton>
          <CustomButton>Save draft</CustomButton>
        </ActionButtonWrapper>
      </div>
    </form>
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
