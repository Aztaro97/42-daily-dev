import * as z from "zod"

export const tagSchema = z.object({
	id: z.string().optional(),
	name: z.string(),
	slug: z.string().optional(),
})

export const postSchema = z.object({
	id: z.string(),
	title: z.string().max(128),
	tags: z.array(tagSchema),
	coverImage: z.any().optional(),
	content: z.any().optional(),
	published: z.boolean(),
})
