import cloudinary from "@/lib/cloudinary";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { tagSchema } from "@/schema/postSchema"
import { z } from "zod";
import slugify from "slugify"
import { uidGenerator } from "@/lib/uidGenerator";
import { DATA_COVER_IMAGE_URL_KEY } from "@/components/coverImageUploader";



export const likeRouter = createTRPCRouter({
	createLike: protectedProcedure.input(
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

			// Check if the user has already liked the post
			if (previousLike) {
				// Check if the user is changing his like
				if (previousLike.dislike !== dislike) {
					// Update or Create the like
					const updatedLike = await prisma.like.upsert({
						where: {
							userId_postId: {
								postId,
								userId: userId as string,
							}
						},
						create: {
							userId: userId as string,
							postId
						},

						update: {
							dislike
						}
					})

					return updatedLike
				}

				// Check if the user is changing his like
				if (previousLike.dislike === dislike) {
					// Delete the like
					const deletedLike = await prisma.like.delete({
						where: {
							userId_postId: {
								userId: userId as string,
								postId
							}
						}
					})

					return deletedLike
				}
			} else {
				// Create the like
				const createdLike = await prisma.like.create({
					data: {
						userId: userId as string,
						postId,
						dislike
					}
				})

				return createdLike
			}


		})


})