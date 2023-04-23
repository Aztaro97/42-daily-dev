import * as z from "zod"

export const postSchema = z.object({
	id:z.string(),
	title: z.string().min(3).max(128).optional(),
	content: z.any().optional(),
	published: z.boolean(),
})
