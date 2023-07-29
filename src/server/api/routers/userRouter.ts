import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { editProfileSchema } from "@/schema/postSchema"
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createCloudImage, deleteCloudImage } from "@/lib/cloudUploading";
import { extractPublicId } from 'cloudinary-build-url'


export const userRouter = createTRPCRouter({
	getUserProfileByLogin: publicProcedure.input(
		z.object({
			login: z.string()
		})
	).query(async ({ ctx, input }) => {
		const { login } = input;
		const { prisma } = ctx;

		const profile = await prisma.user.findUnique({
			where: {
				login
			},
			include: {
				following: true,
				followers: true,
				_count: true,
			}
		});

		if (!profile) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "User not found"
			})
		}

		return profile
	}),

	getMyProfile: protectedProcedure.query(({ ctx }) => {
		const { session: { userId } } = ctx;

		return ctx.prisma.user.findUnique({
			where: {
				id: userId
			},
		})
	}),

	updateMyProfile: protectedProcedure.input(editProfileSchema).mutation(async ({ ctx, input }) => {
		const { prisma, session: { userId } } = ctx;

		const { name, email, login, bio, githubUrl, twitterUrl, websiteUrl } = input;

		const user = await prisma.user.findUnique({
			where: {
				id: userId
			}
		})

		if (!user) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "User not found"
			})
		}

		const updatedUser = await prisma.user.update({
			where: {
				id: userId
			},
			data: {
				name, email, login, bio, githubUrl, twitterUrl, websiteUrl
			}
		})

		return updatedUser
	}),

	updateUserPicture: protectedProcedure.input(z.object({
		base64Image: z.string()
	})).mutation(async ({ ctx, input }) => {
		const { session: { userId }, prisma } = ctx;
		const { base64Image } = input;

		const user = await prisma.user.findFirst({
			where: {
				id: userId
			},
			select: {
				image: true,
				id: true
			}
		})

		if (!user) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "User Not Fund"
			})
		}

		// Destroy if existing Image Exist
		if (user.image) {
			const publicId = extractPublicId(user.image)
			await deleteCloudImage(publicId);
		}

		// Upload new Image to the Cloud
		const cloudImage = await createCloudImage(base64Image)

		// Updated Post Image Cover
		return prisma.user.update({
			where: {
				id: userId
			},
			data: {
				image: cloudImage.secure_url
			}
		})
	}),
})