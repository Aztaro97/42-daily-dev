import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";


export const likeRouter = createTRPCRouter({
	toggleLike: protectedProcedure.input(
		z.object({
			postId: z.string(),
			dislike: z.boolean()
		})).mutation(async ({ ctx, input }) => {
			const { postId, dislike } = input;
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

			const previousLike = await prisma.like.findFirst({
				where: {
					userId,
					postId
				},
			});

			// Check if the user has not liked the post
			// Then create new like post
			if (!previousLike) {
				const createdLike = await prisma.like.create({
					data: {
						userId: userId as string,
						postId,
						dislike
					}
				})

				return {
					message: "Create new like",
					data: createdLike
				}
			}

			// Check if the user has already liked the post
			if (previousLike) {

				// Check if the user is changing his like 
				// Delete the like
				if (previousLike.dislike !== dislike) {
					const deletedLike = await prisma.like.delete({
						where: {
							userId_postId: {
								userId: userId as string,
								postId
							}
						}
					})

					return {
						message: "Delete the post",
						data: deletedLike
					}
				}
			}


		})


})