import React, { useEffect } from "react"
import styled from "@emotion/styled"
import { zodResolver } from "@hookform/resolvers/zod"
import blobUtil from "blob-util"
import { Divider } from "react-daisyui"
import { Controller, useForm } from "react-hook-form"
import TextareaAutoSize from "react-textarea-autosize"
import tw from "twin.macro"
import { z } from "zod"

import { api } from "@/utils/api"
import { convertToBase64 } from "@/utils/utils"
import CustomButton from "@/components/ui/customButton"
import { postSchema } from "@/schema/postSchema"
import { successAlert } from "../alert"
import CoverImageUploader from "../coverImageUploader"
import FieldErrorMessage from "../fieldErrorMessage"
import MarkdownEditor from "../markdownEditor"
import SelectInput from "../ui/SelectInput"

type FormData = z.infer<typeof postSchema>

interface editorProps extends FormData {
  image: string
}

export default function Editor({ postData }: { postData: editorProps }) {
  const { content, id: postId, image, published, title, tags } = postData

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      id: postId,
      tags,
      published,
      content,
    },
  })

  const updatePost = api.blog.updatePost.useMutation()

  const onSubmit = async (formData: FormData) => {
    if (isValid) {
      const response = await updatePost.mutateAsync({
        id: formData.id,
        title: formData.title,
        tags: formData.tags,
        published: true,
        content: formData.content,
      })
      if (response) {
        successAlert("Post Published")
      }
    }
  }

  const onPublish = () => {
    console.log(" on onPublish")
    console.log(errors)
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FieldErrorMessage errors={errors} name="title">
        <TextareaAutoSizeStyled
          autoFocus
          id="title"
          defaultValue={title}
          placeholder="New Post title here..."
          {...register("title", { required: "This is require" })}
        />
      </FieldErrorMessage>

      <DividerStyled />

      <CoverImageUploader imageUrl={image} postId={postId} />

      <FieldErrorMessage errors={errors} name="tags">
        <Controller
          name="tags"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <SelectInput
              defaultValue={tags}
              onBlur={onBlur}
              onChange={onChange}
              value={value}
            />
          )}
        />
      </FieldErrorMessage>
      <DividerStyled />

      <FieldErrorMessage errors={errors} name="content">
        <Controller
          name={"content"}
          control={control}
          render={({ field: { value, ...rest } }) => (
            <MarkdownEditor className="h-72" value={value} {...rest} />
          )}
        />
      </FieldErrorMessage>

      <ActionButtonWrapper>
        <CustomButton
          variants="primary"
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
