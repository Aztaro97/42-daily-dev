import cloudinary from "@/lib/cloudinary";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { editProfileSchema, tagSchema } from "@/schema/postSchema"
import { z } from "zod";
import slugify from "slugify"
import { uidGenerator } from "@/lib/uidGenerator";
import { DATA_COVER_IMAGE_URL_KEY } from "@/components/coverImageUploader";
import { TRPCError } from "@trpc/server";
import { createImage, deleteImage } from "./uploadRouter";



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
			}
		})

		if (!user) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "Post Not Fund"
			})
		}

		// Destroy if existing Image Exist
		if (user.image) {
			const publicId = user.image.split(".")[0]
			await deleteImage(publicId as string);
		}

		// Upload new Image to the Cloud
		const cloudImage = await createImage(base64Image)

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