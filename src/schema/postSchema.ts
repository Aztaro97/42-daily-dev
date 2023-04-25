import * as z from "zod"

export const postSchema = z.object({
	id:z.string(),
	title: z.string().max(128),
	content: z.any().optional(),
	published: z.boolean(),
})
