import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "../trpc"
import { TRPCError } from "@trpc/server";

export const commentRouter = createTRPCRouter({
	createComment: protectedProcedure.input(z.object({
		postId: z.string(),
		content: z.string(),
	})).mutation(async ({ ctx, input }) => {
		const { content, postId } = input;
		const { prisma, session: { userId } } = ctx;

		const post = prisma.post.findFirst({
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
		const comment = prisma.comment.create({
			data: {
				content,
				post: {
					connect: {
						id: postId
					}
				},
				author: {
					connect: {
						id: userId
					}
				}
			}
		})

		return comment
	}),

	deleteComment: protectedProcedure.input(z.object({
		commentId: z.string(),
	})).mutation(async ({ ctx, input }) => {
		const { commentId } = input;
		const { prisma, session: { userId } } = ctx;

		const comment = await prisma.comment.findFirst({
			where: {
				id: commentId
			}
		})

		if (!comment) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "Comment Not Fund"
			})
		}

		if (comment.authorId !== userId) {
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "You're not the author of the comment"
			})
		}

		const deleteComment = prisma.comment.delete({
			where: {
				id: commentId
			}
		})

		return deleteComment;
	})


})