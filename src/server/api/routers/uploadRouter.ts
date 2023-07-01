import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { extractPublicId } from 'cloudinary-build-url'
import { DATA_COVER_IMAGE_URL_KEY } from "@/components/coverImageUploader";
import { createCloudImage, deleteCloudImage } from "@/lib/cloudUploading";


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
			const publicId = extractPublicId(post.image)
			await deleteCloudImage(publicId);
		}

		// Upload new Image to the Cloud
		const cloudImage = await createCloudImage(base64Image)

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

		// Delete Image From Cloudinary
		// Filter to get Public Id
		if (post.image) {
			const publicId = extractPublicId(post.image)
			await deleteCloudImage(publicId);
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