import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Form, Input, InputGroup, Modal, Textarea } from "react-daisyui"
import { useForm } from "react-hook-form"
import { AiOutlineLink } from "react-icons/ai"
import { FaGithub, FaTwitter, FaUser } from "react-icons/fa"
import { MdAlternateEmail, MdOutlineMail } from "react-icons/md"
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
      name: data?.name,
      email: data?.email,
      login: data?.login,
      bio: data?.bio,
      githubUrl: data?.githubUrl,
      twitterUrl: data?.twitterUrl,
      websiteUrl: data?.websiteUrl,
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
          <InputGroup>
            <span>
              <FaUser />
            </span>
            <Input
              id="name"
              placeholder="Enter Your Full Name"
              className="w-full"
              {...register("name")}
            />
          </InputGroup>
        </FormGroup>
      </FieldErrorMessage>

      <FieldErrorMessage errors={errors} name="login">
        <FormGroup>
          <Form.Label htmlFor="login" title="login ID" />

          <InputGroup>
            <span>
              <MdAlternateEmail />
            </span>
            <Input
              id="login"
              disabled
              placeholder="Enter login Name"
              className="w-full"
              {...register("login")}
            />
          </InputGroup>
        </FormGroup>
      </FieldErrorMessage>
      <FieldErrorMessage errors={errors} name="email">
        <FormGroup>
          <Form.Label htmlFor="email" title="Email" />
          <InputGroup>
            <span>
              <MdOutlineMail />
            </span>
            <Input
              id="email"
              disabled
              placeholder="Email Adress"
              className="w-full"
              {...register("email")}
            />
          </InputGroup>
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

      <FieldErrorMessage errors={errors} name="githubUrl">
        <FormGroup>
          <Form.Label htmlFor="githubUrl" title="Github" />
          <InputGroup>
            <span>
              <FaGithub />
            </span>
            <Input
              type="url"
              id="githubUrl"
              placeholder="Enter url"
              className="w-full"
              {...register("githubUrl")}
            />
          </InputGroup>
        </FormGroup>
      </FieldErrorMessage>
      <FieldErrorMessage errors={errors} name="twitterUrl">
        <FormGroup>
          <Form.Label htmlFor="twitterUrl" title="Twitter" />
          <InputGroup>
            <span>
              <FaTwitter />
            </span>
            <Input
              type="url"
              id="twitterUrl"
              placeholder="Enter url"
              className="w-full"
              {...register("twitterUrl")}
            />
          </InputGroup>
        </FormGroup>
      </FieldErrorMessage>
      <FieldErrorMessage errors={errors} name="websiteUrl">
        <FormGroup>
          <Form.Label htmlFor="websiteUrl" title="WebSite" />
          <InputGroup>
            <span>
              <AiOutlineLink />
            </span>
            <Input
              type="url"
              id="websiteUrl"
              placeholder="https://yoursite.com"
              className="w-full"
              {...register("websiteUrl")}
            />
          </InputGroup>
        </FormGroup>
      </FieldErrorMessage>
      <CustomButton
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
