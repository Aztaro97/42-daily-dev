import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import cloudinary from "@/lib/cloudinary";
import { DATA_COVER_IMAGE_URL_KEY } from "@/components/coverImageUploader";


export const createImage = async (base64Image: string) => {
	try {
		const imageResponse = await cloudinary.v2.uploader.upload(base64Image, { resource_type: 'image' });
		return imageResponse
	} catch (error) {
		console.log(error)
		throw new TRPCError({
			code: 'INTERNAL_SERVER_ERROR',
			message: 'Error Uploading Image',
		})

	}
}

export const deleteImage = async (publicId: string) => {
	try {
		await cloudinary.v2.uploader.destroy(publicId)
	} catch (error) {
		console.log(error);
	}
}

export const uploadRouter = createTRPCRouter({
	uploadPostImage: protectedProcedure.input(z.object({
		postId: z.string(),
		files: z.any()
	})).mutation(async ({ ctx, input }) => {
		const { session, prisma } = ctx;
		const { postId, files } = input;

		// Get Cover Image Url
		const base64Image = files[0][DATA_COVER_IMAGE_URL_KEY] as string

		const post = await prisma.post.findFirst({
			where: {
				id: postId
			}
		})

		if (!post) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "Post Not Fund"
			})
		}

		// Destroy if existing Image Exist
		if (post.image) {
			const publicId = post.image.split(".")[0]
			await deleteImage(publicId as string);
		}

		// Upload new Image to the Cloud
		const cloudImage = await createImage(base64Image)

		// Updated Post Image Cover
		return prisma.post.update({
			where: {
				id: postId
			},
			data: {
				image: cloudImage.secure_url
			}
		})
	}),

	destroyPostImage: protectedProcedure.input(z.object({
		postId: z.string(),
	})).mutation(async ({ ctx, input }) => {
		const { prisma } = ctx;
		const { postId } = input;

		const post = await prisma.post.findFirst({
			where: {
				id: postId
			}
		})

		if (!post) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "Post Not Fund"
			})
		}

		// const url = new URL(img)
		// const public_id = url.pathname.split("/").pop().split(".")[0]
		// console.log(public_id)

		// Delete Image From Cloudinary
		// Filter to get Public Id
		if (post.image) {
			const publicId = post.image.split(".")[0]
			await deleteImage(publicId as string);
		}

		// Delete Image from the Post
		return prisma.post.update({
			where: {
				id: postId
			},
			data: {
				image: null
			}
		})
	}),
})