import cloudinary from "@/lib/cloudinary";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { tagSchema } from "@/schema/postSchema"
import { z } from "zod";
import slugify from "slugify"
import { uidGenerator } from "@/lib/uidGenerator";
import { DATA_COVER_IMAGE_URL_KEY } from "@/components/coverImageUploader";
import { TRPCError } from "@trpc/server";



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
	})

})