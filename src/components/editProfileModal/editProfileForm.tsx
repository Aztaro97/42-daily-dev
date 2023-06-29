import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Form, Input, InputGroup, Modal, Textarea } from "react-daisyui"
import { useForm } from "react-hook-form"
import { AiOutlineLink } from "react-icons/ai"
import { FaGithub, FaTwitter } from "react-icons/fa"
import Skeleton from "react-loading-skeleton"
import tw from "twin.macro"
import { z } from "zod"

import { api } from "@/utils/api"
import { editProfileSchema } from "@/schema/postSchema"
import useStore from "@/stores/useStore"
import { successAlert } from "../alert"
import FieldErrorMessage from "../fieldErrorMessage"
import CustomButton from "../ui/customButton"

type TEditForm = z.infer<typeof editProfileSchema>
interface Props {
  data: TEditForm
}

const EditProfileForm = ({ data }: Props) => {
  const { setShowEditModal } = useStore()
  const tRpcUtils = api.useContext()

  const { mutate, isLoading, isSuccess } = api.user.updateMyProfile.useMutation(
    {
      onMutate: async (newData) => {
        await tRpcUtils.user.getUserProfileByLogin.cancel()

        const prevData = tRpcUtils.user.getUserProfileByLogin.getData({
          login: data.login,
        })

        tRpcUtils.user.getUserProfileByLogin.setData(
          {
            login: data.login,
          },
          (oldData: any) => {
            return {
              ...oldData,
              ...newData,
            }
          },
        )

        return {
          prevData,
        }
      },
      onSuccess: () => {
        setShowEditModal(false)
        successAlert("Profile Updated Successfully")
      },
      onError: (error, newData, context) => {
        console.log({ error })
        tRpcUtils.user.getUserProfileByLogin.setData(
          {
            login: data.login,
          },
          { ...(context?.prevData as any) },
        )
      },
      onSettled: () => {
        tRpcUtils.user.getUserProfileByLogin.invalidate({
          login: data.login,
        })
      },
    },
  )
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<TEditForm>({
    defaultValues: {
      name: data.name,
      email: data.email,
      login: data.login,
      bio: data.bio,
    },
    resolver: zodResolver(editProfileSchema),
  })

  const onSubmit = (body: TEditForm) => {
    if (!isValid) return null
    mutate(body)
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FieldErrorMessage errors={errors} name="name">
        <FormGroup>
          <Form.Label htmlFor="name" title="Full Name" />
          <Input
            id="name"
            placeholder="Enter Your Full Name"
            {...register("name")}
          />
        </FormGroup>
      </FieldErrorMessage>

      <FieldErrorMessage errors={errors} name="login">
        <FormGroup>
          <Form.Label htmlFor="login" title="login ID" />
          <Input
            id="login"
            disabled
            placeholder="Enter login Name"
            {...register("login")}
          />
        </FormGroup>
      </FieldErrorMessage>
      <FieldErrorMessage errors={errors} name="email">
        <FormGroup>
          <Form.Label htmlFor="email" title="Email" />
          <Input
            id="email"
            disabled
            placeholder="Email Adress"
            {...register("email")}
          />
        </FormGroup>
      </FieldErrorMessage>
      <FieldErrorMessage errors={errors} name="bio">
        <FormGroup>
          <Form.Label htmlFor="bio" title="Bio" />
          <Textarea
            id="bio"
            placeholder="Write a short Bio"
            rows={4}
            {...register("bio")}
          />
        </FormGroup>
      </FieldErrorMessage>

      <FieldErrorMessage errors={errors} name="github">
        <FormGroup>
          <Form.Label htmlFor="github" title="Github" />
          <InputGroup>
            <span>
              <FaGithub />
            </span>
            <Input
              type="url"
              id="github"
              placeholder="sample@email.com"
              className="w-full"
            />
          </InputGroup>
        </FormGroup>
      </FieldErrorMessage>
      <FieldErrorMessage errors={errors} name="twitter">
        <FormGroup>
          <Form.Label htmlFor="twitter" title="Twitter" />
          <InputGroup>
            <span>
              <FaTwitter />
            </span>
            <Input
              type="url"
              id="twitter"
              placeholder="sample@email.com"
              className="w-full"
            />
          </InputGroup>
        </FormGroup>
      </FieldErrorMessage>
      <FieldErrorMessage errors={errors} name="website">
        <FormGroup>
          <Form.Label htmlFor="website" title="WebSite" />
          <InputGroup>
            <span>
              <AiOutlineLink />
            </span>
            <Input
              type="url"
              id="website"
              placeholder="sample@email.com"
              className="w-full"
            />
          </InputGroup>
        </FormGroup>
      </FieldErrorMessage>
      <CustomButton
        tw="mt-3"
        variants="primary"
        type="submit"
        loading={isLoading}
      >
        Update Profile
      </CustomButton>
    </Form>
  )
}

EditProfileForm.Skeleton = function EditProfileFormSkeleton() {
  return (
    <Form className="space-y-5">
      {[...Array(6).keys()].map((el, index) => (
        <FormGroup key={index}>
          <Skeleton height={15} width={70} />
          <Skeleton height={40} className="w-full" />
        </FormGroup>
      ))}
    </Form>
  )
}

const FormGroup = tw.div`form-control`

export default EditProfileForm
