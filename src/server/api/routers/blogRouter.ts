import cloudinary from "@/lib/cloudinary";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { tagSchema } from "@/schema/postSchema"
import { z } from "zod";
import slugify from "slugify"
import { uidGenerator } from "@/lib/uidGenerator";
import { DATA_COVER_IMAGE_URL_KEY } from "@/components/coverImageUploader";

export const createPostSchema = z.object({
	id: z.string(),
	title: z.string(),
	slug: z.string().optional(),
	tags: z.array(tagSchema),
	coverImage: z.any().optional(),
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

			// Generate Post Slug
			const slug = slugify(title, { lower: true }) + "-" + uidGenerator()
			// `${slugify(title)}-${uidGenerator()}`

			// Get Cover Image Url
			const coverImageUrl = coverImage[0][DATA_COVER_IMAGE_URL_KEY] as string

			// console.log("coverImageUrl", coverImageUrl)
			console.log("slug", slug)

			// Create Image 
			const cloudImage = await createImage(coverImageUrl)

			const newPost = await ctx.prisma.post.create({
				data: {
					title,
					content,
					published,
					slug,
					image: cloudImage.secure_url,
					tags: {
						// Existing tags have id, connect them. New tags don't, create them.
						connect: tags?.filter(t => ("id" in t)).map(t => ({ id: t.id })) ?? [],
						create: tags?.filter(t => !("id" in t)).map(t => ({
							name: t.name,
							slug: `${slugify(t.name)}-${uidGenerator()}`,
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

		}),
	// Get all posts by author info
	getAllPosts: publicProcedure.query(async ({ ctx }) => {

		const posts = await ctx.prisma.post.findMany({
			take: 20,
			orderBy: {
				createdAt: "desc"
			},
			where: {
				// Exclude posts that are not published
				published: true
			},
			select: {
				id: true,
				title: true,
				image: true,
				slug: true,
				createdAt: true,
				author: {
					select: {
						id: true,
						name: true,
						email: true,
						image: true,
						login: true
					}
				},
				// Count Number of View and Comment
				_count: {
					select: {
						Comment: true,
						View: true,
						tags: true
					}
				}
			}
		})

		console.log("posts from server", posts)

		return posts;
	})

})