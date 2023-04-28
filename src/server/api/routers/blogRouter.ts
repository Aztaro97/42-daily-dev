import cloudinary from "@/lib/cloudinary";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { tagSchema } from "@/schema/postSchema"
import { z } from "zod";
import slugify from "slugify"
import { uidGenerator } from "@/lib/uidGenerator";

export const createPostSchema = z.object({
	id: z.string(),
	title: z.string(),
	slug: z.string().optional(),
	tags: z.array(tagSchema),
	coverImage: z.string(),
	content: z.any().optional(),
	published: z.boolean().optional(),
})


const createImage = async (base64Image: string) => {
	try {
		const imageResponse = await cloudinary.v2.uploader.upload(base64Image, { resource_type: 'image' });
		return imageResponse
	} catch (error) {
		console.log(error)

	}
}

const deleteImage = async (publicId: string) => {
	try {
		await cloudinary.v2.uploader.destroy(publicId)
	} catch (error) {
		console.log(error);
	}
}


export const blogRouter = createTRPCRouter({
	uploadEditorImage: protectedProcedure.input(
		z.object({
			file: z.string()
		})
	).mutation(async ({ ctx, input }) => {
		try {
			const { file: base64Image } = input;


			// Generate Image Url from Cloudinadry
			const cloudImage = await createImage(base64Image)

			return {
				url: cloudImage.secure_url,
			};

		} catch (error) {
			console.log(error)
		}
	}),
	deleteEditorImage: protectedProcedure.input(z.object({ public_id: z.string() })).mutation(async ({ ctx, input }) => {
		try {
			const { public_id } = input;

			// Delete Image from Cloudinary
			await deleteImage(public_id);
			return {
				message: "Image Delete"
			};

		} catch (error) {
			console.log(error)
		}
	}),
	createPost: protectedProcedure
		.input(createPostSchema)
		.mutation(async ({ ctx, input }) => {
			const { content, published, tags, title, coverImage } = input
			const authorId = ctx.session.userId;

			// Create Image 
			const cloudImage = await createImage(coverImage)

			const newPost = await ctx.prisma.post.create({
				data: {
					content,
					published,
					title,
					image: cloudImage.secure_url,
					slug: `${slugify(title)}-${uidGenerator()}`,
					tags: {
						// Existing tags have id, connect them. New tags don't, create them.
						connect: tags?.filter(t => ("id" in t)).map(t => ({ id: t.id })) ?? [],
						create: tags?.filter(t => !("id" in t)).map(t => ({
							name: t.name,
							slug: `${slugify(t.name)}}`,
						})) ?? [],
					},
					author: {
						connect: {
							id: authorId
						}
					}
				},
			})

			return newPost

		})
})