import * as z from "zod"

export const tagSchema = z.object({
	id: z.string().optional(),
	name: z.string(),
	slug: z.string().optional(),
})

export const postSchema = z.object({
	id: z.string(),
	title: z.string({
		required_error: "The title is required"
	}).min(8, "Min 8 length").max(128, "The maximum of title should be 128 character"),
	content: z.string({
		required_error: "The content is required"
	}).min(10),
	published: z.boolean(),
	tags: z.array(tagSchema).max(3, {
		message: "The maximum of tags should be 3"
	}).optional(),
})

export const updatePostSchema = z.object({
	id: z.string(),
	title: z.string(),
	slug: z.string().optional(),
	tags: z.array(tagSchema).optional(),
	content: z.any().optional(),
	published: z.boolean().optional(),
})

export const commentSchema = z.object({
	content: z.string({
		required_error: "The content is required"
	}),
})


export const editProfileSchema = z.object({
	name: z.string({
		required_error: "The Full Name is required"
	}),
	login: z.string({
		required_error: "The Login ID is required"
	}),
	email: z.string({
		required_error: "The Email is required"
	}),
	bio: z.string().max(170).optional(),
	githubUrl: z.string().url().optional(),
	twitterUrl: z.string().url().optional(),
	websiteUrl: z.string().url().optional(),
})