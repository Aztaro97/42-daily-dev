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
	coverImage: z.any().optional(),
	content: z.string({
		required_error: "The content is required"
	}).min(10),
	published: z.boolean(),
	tags: z.array(tagSchema).optional(),
})

export const commentSchema = z.object({
	content: z.string({
		required_error: "The content is required"
	}),
})
