import cloudinary from "@/lib/cloudinary";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { tagSchema } from "@/schema/postSchema"
import { z } from "zod";
import slugify from "slugify"
import { uidGenerator } from "@/lib/uidGenerator";
import { DATA_COVER_IMAGE_URL_KEY } from "@/components/coverImageUploader";



export const bookmarkRouter = createTRPCRouter({
	createBookmark: protectedProcedure.input(
		z.object({
			postId: z.string()
		})
	)
		.mutation(async ({ ctx, input }) => {
			const { postId } = input;
			const { prisma, session: { userId } } = ctx;

			const post = await prisma.post.findUnique({
				where: {
					id: postId
				}
			});

			// Check if the Post Exist
			if (!post) {
				throw new Error("Post not found")
			}

			const bookmark = await prisma.bookmark.create({
				data: {
					post: {
						connect: {
							id: postId
						}
					},
					user: {
						connect: {
							id: userId
						}
					}
				}
			});

			return bookmark
		}),

	deleteBookmark: protectedProcedure.input(
		z.object({
			postId: z.string()
		})
	)
		.mutation(async ({ ctx, input }) => {
			const { postId } = input;
			const { prisma, session: { user } } = ctx;

			const post = await prisma.post.findUnique({
				where: {
					id: postId
				}
			});

			// Check if the Post Exist
			if (!post) {
				throw new Error("Post not found")
			}

			const bookmark = await prisma.bookmark.delete({
				where: {
					// postId_userId: {
					// 	postId,
					// 	userId: user.id
					// }
				}
			});

			return bookmark
		}
		),

})