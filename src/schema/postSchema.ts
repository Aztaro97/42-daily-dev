import * as z from "zod"

export const tagSchema = z.object({
	// id: z.string().optional(),
	name: z.string(),
})

export const postSchema = z.object({
	id: z.string(),
	title: z.string().max(128),
	tags: z.array(tagSchema),
	content: z.any().optional(),
	published: z.boolean(),
})
