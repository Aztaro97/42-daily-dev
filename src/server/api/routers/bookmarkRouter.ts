import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";




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