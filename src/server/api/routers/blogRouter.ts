import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { updatePostSchema } from "@/schema/postSchema"
import { z } from "zod";
import slugify from "slugify"
import { uidGenerator } from "@/lib/uidGenerator";
import { TRPCError } from "@trpc/server";
import { createCloudImage, deleteCloudImage } from "@/lib/cloudUploading";


export const blogRouter = createTRPCRouter({
	uploadEditorImage: protectedProcedure.input(
		z.object({
			file: z.string()
		})
	).mutation(async ({ ctx, input }) => {
		try {
			const { file: base64Image } = input;

			// Generate Image Url from Cloudinadry
			const cloudImage = await createCloudImage(base64Image)

			return {
				url: cloudImage.secure_url,
			};

		} catch (error) {
			console.log(error)
		}
	}),
	deleteEditorImage: protectedProcedure.input(z.object({ public_id: z.string() })).mutation(async ({ ctx, input }) => {
		try {
			const { public_id } = input;

			// Delete Image from Cloudinary
			await deleteCloudImage(public_id);
			return {
				message: "Image Delete"
			};

		} catch (error) {
			console.log(error)
		}
	}),

	// Create new Post
	createPost: protectedProcedure.input(z.object({
		title: z.string()
	})).mutation(async ({ ctx, input }) => {
		const { title } = input;
		const authorId = ctx.session.userId;

		const slug = slugify(title, { lower: true }) + "-" + uidGenerator()

		const newPost = ctx.prisma.post.create({
			data: {
				title,
				slug,
				author: {
					connect: {
						id: authorId
					}
				},
			},
		})

		return newPost;
	}),


	// Updated Post as Draft By Id
	createDraftPost: protectedProcedure
		.input(updatePostSchema)
		.mutation(async ({ ctx, input }) => {
			const { content, tags, title, id: postId } = input
			const authorId = ctx.session.userId;

			// Generate Post Slug
			const slug = slugify(title, { lower: true }) + "-" + uidGenerator()

			const newPost = await ctx.prisma.post.update({
				where: {
					id: postId
				},
				data: {
					title,
					content,
					published: false,
					slug,
					tags: {
						// Existing tags have id, connect them. New tags don't, create them.
						connect: tags?.filter(t => ("id" in t)).map(t => ({ id: t.id })) ?? [],
						create: tags?.filter(t => !("id" in t)).map(t => ({
							name: t.name,
							slug: `${slugify(t.name)}-${uidGenerator()}`,
						})) ?? [],
					},
					author: {
						connect: {
							id: authorId
						}
					}
				},
			})

			return newPost
		}),

	// Updated Post as Published By Id
	publishedPost: protectedProcedure
		.input(updatePostSchema)
		.mutation(async ({ ctx, input }) => {
			const { content, tags, title, id: postId } = input
			const authorId = ctx.session.userId;

			// Generate Post Slug
			const slug = slugify(title, { lower: true }) + "-" + uidGenerator()

			const newPost = await ctx.prisma.post.update({
				where: {
					id: postId
				},
				data: {
					title,
					content,
					published: true,
					slug,
					tags: {
						// Existing tags have id, connect them. New tags don't, create them.
						connect: tags?.filter(t => ("id" in t)).map(t => ({ id: t.id })) ?? [],
						create: tags?.filter(t => !("id" in t)).map(t => ({
							name: t.name,
							slug: `${slugify(t.name)}-${uidGenerator()}`,
						})) ?? [],
					},
					author: {
						connect: {
							id: authorId
						}
					}
				},
			})

			return newPost
		}),

	// Get All User Post
	getAllUserPost: protectedProcedure.input(z.object({
		limit: z.number(),
		cursor: z.string().nullish(),
		userId: z.string().optional(),
		published: z.boolean().optional(),
	})).query(async ({ ctx, input }) => {
		const authorId = ctx.session.userId;
		const { limit, cursor, published, userId } = input

		const posts = await ctx.prisma.post.findMany({
			take: limit + 1,
			cursor: cursor ? { id: cursor } : undefined,
			where: {
				authorId
			},
			...(published && {
				where: {
					published
				}
			}),
			orderBy: {
				createdAt: "desc"
			},
			select: {
				id: true,
				title: true,
				slug: true,
				image: true,
				createdAt: true,
				published: true,
				author: {
					select: {
						name: true,
						login: true
					}
				},
			}
		})

		let nextCursor: typeof cursor | undefined = undefined
		if (posts.length > limit) {
			const nextPost = posts.pop()
			nextCursor = nextPost!?.id
		}

		return {
			posts,
			hasMore: posts.length > limit,
			nextCursor,
		};

	}),

	// Delete Post By ID
	deletePostById: protectedProcedure.input(z.object({ postId: z.string() })).mutation(async ({ ctx, input }) => {
		const { postId } = input;
		const authorId = ctx.session.userId;

		const post = await ctx.prisma.post.findUnique({
			where: {
				id: postId
			},
			select: {
				id: true,
				image: true,
				author: {
					select: {
						id: true,
					}
				}
			}
		})

		if (post?.author?.id !== authorId) {
			throw new TRPCError({ code: "FORBIDDEN", message: "You are not allowed to delete this post" })
		}

		// Destroy Image from the cloud
		if (post?.image) {
			const publicId = post.image.split(".")[0]
			await deleteCloudImage(publicId as string);
		}

		await ctx.prisma.post.delete({
			where: {
				id: postId
			}
		})

		return {
			message: "Post Deleted"
		}

	}),


	// Get all posts by author info
	getAllPosts: publicProcedure.input(z.object({
		limit: z.number(),
		cursor: z.string().nullish(),
		userId: z.string().optional(),
		published: z.boolean().optional()

	})).query(async ({ ctx, input }) => {
		const { limit, cursor, userId, published } = input

		const posts = await ctx.prisma.post.findMany({
			take: limit + 1,
			orderBy: {
				createdAt: "desc"
			},
			cursor: cursor ? { id: cursor } : undefined,
			...(published && {
				where: {
					published
				}
			}),
			...(userId && {
				where: {
					authorId: userId
				}
			}),
			select: {
				id: true,
				title: true,
				image: true,
				slug: true,
				createdAt: true,
				author: {
					select: {
						id: true,
						name: true,
						email: true,
						image: true,
						login: true
					}
				},
				likes: {
					select: {
						userId: true,
						dislike: true,

					}
				},
				// Count Number of View and Comment
				_count: {
					select: {
						comments: true,
						views: true,
						tags: true,
						likes: true
					}
				}
			}
		})

		let nextCursor: typeof cursor | undefined = undefined
		if (posts.length > limit) {
			const nextPost = posts.pop()
			nextCursor = nextPost!?.id
		}

		return {
			posts,
			hasMore: posts.length > limit,
			nextCursor,
		};
	}),

	// Get Post for User
	getPostForUserById: protectedProcedure.input(z.object({
		postId: z.string()
	})).query(async ({ ctx, input }) => {
		const { postId } = input;

		const post = ctx.prisma.post.findUnique({
			where: {
				id: postId
			},
			include: {
				tags: true
			}
		})

		if (!post) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: "Post Not Exit",
			})
		}

		return post;
	}),


	// GET POST LIKED FROM USER_ID
	getPostsLiked: publicProcedure.input(z.object({
		userId: z.string(),
		limit: z.number(),
		cursor: z.string().nullish(),
		published: z.boolean().optional()
	})).query(async ({ ctx, input }) => {
		const { userId, cursor, limit, published } = input;

		const posts = await ctx.prisma.post.findMany({
			take: limit + 1,
			orderBy: {
				createdAt: "desc"
			},
			cursor: cursor ? { id: cursor } : undefined,
			where: {
				likes: {
					some: {
						userId,
						dislike: true
					}
				},
				// We don't want to list the user's own posts,
				// as they are liked by the user automatically on creation.
				NOT: {
					authorId: userId
				},

			},
			...(published && {
				where: {
					published
				}
			}),
			select: {
				id: true,
				title: true,
				image: true,
				slug: true,
				createdAt: true,
				author: {
					select: {
						id: true,
						name: true,
						email: true,
						image: true,
						login: true
					}
				},
				likes: {
					select: {
						userId: true,
						dislike: true,

					}
				}
				,
				// Count Number of View and Comment
				_count: {
					select: {
						comments: true,
						views: true,
						tags: true,
						likes: true
					}
				}
			},
			// include: {
			// 	likes: true,
			// 	author: true,
			// 	tags: true
			// },

		})

		let nextCursor: typeof cursor | undefined = undefined
		if (posts.length > limit) {
			const nextPost = posts.pop()
			nextCursor = nextPost!?.id
		}

		return {
			posts,
			hasMore: posts.length > limit,
			nextCursor,
		};
	}),




	// GET POST BY ID
	getPostBySlug: publicProcedure.input(z.object({
		slug: z.string()
	})).query(async ({ ctx, input }) => {
		const { slug } = input;
		const post = await ctx.prisma.post.findFirst({
			where: {
				slug
			},
			select: {
				id: true,
				title: true,
				slug: true,
				image: true,
				author: true,
				content: true,
				createdAt: true,
				updatedAt: true,
				tags: true,
				likes: {
					select: {
						userId: true,
						dislike: true,
					}
				},
				_count: true,
			}
		})

		return post
	}),

	// Filter Post by name and tags
	getPosts: publicProcedure.input(z.object({
		query: z.string(),
		limit: z.number(),
		cursor: z.string().nullish(),
	})).query(async ({ ctx, input }) => {
		const { query, limit, cursor } = input;

		const posts = await ctx.prisma.post.findMany({
			take: limit + 1,
			cursor: cursor ? { id: cursor } : undefined,
			orderBy: {
				createdAt: "desc"
			},
			where: {
				OR: [
					{
						title: {
							contains: query
						}
					},
					{
						tags: {
							some: {
								name: {
									contains: query
								}
							}
						}
					}
				]
			},
			select: {
				id: true,
				title: true,
				image: true,
				slug: true,
				createdAt: true,
				author: {
					select: {
						id: true,
						name: true,
						email: true,
						image: true,
						login: true
					}
				},
				likes: {
					select: {
						userId: true,
						dislike: true,

					}
				},
				// Count Number of View and Comment
				_count: {
					select: {
						comments: true,
						views: true,
						tags: true,
						likes: true
					}
				}
			}
		})

		let nextCursor: typeof cursor | undefined = undefined
		if (posts.length > limit) {
			const nextPost = posts.pop()
			nextCursor = nextPost!?.id
		}

		return {
			posts,
			hasMore: posts.length > limit,
			nextCursor,
		};

	}),

	// Get Posts related to the actual post by slugs name
	getRelatedPosts: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ ctx, input }) => {
		const { slug } = input;

		const post = await ctx.prisma.post.findFirst({
			where: {
				slug
			},
			select: {
				id: true,
				tags: true
			}
		})

		if (!post) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "Post Not Fund"
			})
		}

		const posts = ctx.prisma.post.findMany({
			orderBy: {
				createdAt: "desc"
			},
			where: {
				tags: {
					some: {
						name: {
							in: post.tags.map(tag => tag.name)
						}
					}
				}
			},
			select: {
				id: true,
				title: true,
				slug: true,
				tags: true,
				author: true,
				likes: {
					select: {
						userId: true,
						dislike: true,

					}
				},
			},
			take: 5
		})

		return posts
	})
})