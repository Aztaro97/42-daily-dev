import React from "react"
import styled from "@emotion/styled"
import { zodResolver } from "@hookform/resolvers/zod"
import { Divider } from "react-daisyui"
import { Controller, useForm } from "react-hook-form"
import TextareaAutoSize from "react-textarea-autosize"
import tw from "twin.macro"
import { z } from "zod"

import { api } from "@/utils/api"
import CustomButton from "@/components/ui/customButton"
import { postSchema } from "@/schema/postSchema"
import { successAlert } from "../alert"
import CoverImageUploader from "../coverImageUploader"
import MarkdownEditor from "../markdownEditor"
import SelectInput from "../ui/SelectInput"

interface editorProps {
  post: z.infer<typeof postSchema>
}

type FormData = z.infer<typeof postSchema>

export default function Editor({ post }: editorProps) {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      id: post.id,
      coverImage: post.coverImage,
      tags: post.tags,
      published: post.published,
      content: post.content,
    },
  })

  const uploadEditorImage = api.blog.uploadEditorImage.useMutation()
  const deleteEditorImage = api.blog.deleteEditorImage.useMutation()
  const updatePost = api.blog.updatePost.useMutation()

  const onSubmit = async (formData: FormData) => {
    const response = await updatePost.mutateAsync({
      id: formData.id,
      title: formData.title,
      tags: formData.tags,
      published: true,
      coverImage: formData.coverImage,
      content: formData.content,
    })
    if (response) {
      successAlert("Post Published")
    }
  }

  const onPublish = () => {
    console.log(" on onPublish")
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <TextareaAutoSizeStyled
        autoFocus
        id="title"
        defaultValue={post.title}
        placeholder="New Post title here..."
        {...register("title")}
      />
      <DividerStyled />
      <Controller
        name="coverImage"
        control={control}
        render={({ field: { onChange, value } }) => (
          <CoverImageUploader
            imageUrl={post.coverImage}
            onChangeImage={onChange}
            value={value}
          />
        )}
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
      <DividerStyled />
      {/* <EditorBox id={EDITOR_HOLDER_ID}></EditorBox> */}
      <Controller
        name={"content"}
        control={control}
        render={({ field: { value, ...rest } }) => (
          <MarkdownEditor value={value} {...rest} />
        )}
      />

      <ActionButtonWrapper>
        <CustomButton
          bgColor="primary"
          type="submit"
          loading={updatePost.isLoading}
          onClick={onPublish}
        >
          Publish
        </CustomButton>
        <CustomButton>Save draft</CustomButton>
      </ActionButtonWrapper>
    </Form>
  )
}

const Form = tw.form`mx-auto w-full max-w-[900px] flex flex-col gap-5`
const ActionButtonWrapper = tw.div`flex justify-end items-center gap-3`
const EditorBox = styled.div`
  ${tw`w-full max-w-full prose min-h-[40px] mb-5`}
  & .ce-block__content {
    /* ${tw`mx-0 ml-4`} */
  }

  & .ce-popover--opened {
    ${tw`z-50 border border-white bg-slate-900 border-opacity-40`}

    & .cdx-search-field {
      ${tw`bg-transparent`}
    }

    & .ce-popover__item-icon {
      ${tw`bg-transparent`}
    }

    & .ce-popover__item:hover {
      ${tw`text-white bg-primary`}
    }
  }

  & .ce-block--selected .ce-block__content {
    ${tw`bg-blue-900`}
  }

  & .ce-toolbar__plus,
  & .ce-toolbar__settings-btn {
    ${tw`text-white bg-primary`}
  }
`
const DividerStyled = tw(Divider)`my-0`
const TextareaAutoSizeStyled = tw(
  TextareaAutoSize,
)`w-full px-3 py-1 mt-6 overflow-hidden text-5xl font-bold bg-transparent appearance-none resize-none focus:outline-none`
