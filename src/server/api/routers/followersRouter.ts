import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "../trpc"
import { TRPCError } from "@trpc/server";

export const followersRouter = createTRPCRouter({
	setFollowUser: protectedProcedure.input(z.object({
		followingId: z.string(),
	})).mutation(async ({ ctx, input }) => {
		const { followingId } = input;
		const { session: { userId } } = ctx;

		if (!userId) {
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "User not logged in"
			})
		}

		const follow = await ctx.prisma.follows.findFirst({
			where: {
				followerId: userId as string,
				followingId
			},

		});

		// Check if the user has not followed the user
		if (follow) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "User Already Followed",
			})
		}

		const createdFollow = await ctx.prisma.follows.create({
			data: {
				followerId: userId as string,
				followingId
			}
		})

		return {
			message: "User Followed",
			data: createdFollow
		}
	}),

	deleteFollowUser: protectedProcedure.input(z.object({
		followingId: z.string(),
	})).mutation(async ({ ctx, input }) => {
		const { followingId } = input;
		const { session: { userId } } = ctx;

		if (!userId) {
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "User not logged in"
			})
		}

		const follow = await ctx.prisma.follows.findFirst({
			where: {
				followerId: userId as string,
				followingId
			},

		});

		// Check if the user has not followed the user
		if (!follow) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "User not followed",
			})
		}

		const deletedFollow = await ctx.prisma.follows.delete({
			where: {
				followerId_followingId: {
					followerId: userId as string,
					followingId
				}
			}
		})

		return {
			message: "User Unfollowed",
			data: deletedFollow
		}
	})
}) 