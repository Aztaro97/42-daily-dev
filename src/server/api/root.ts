import { createTRPCRouter } from "@/server/api/trpc";
import { blogRouter } from "./routers/blogRouter";
import { likeRouter } from "./routers/likeRouter";
import { userRouter } from "./routers/userRouter";
import { followersRouter } from "./routers/followersRouter";
import { commentRouter } from "./routers/commentRouter";
import { uploadRouter } from "./routers/uploadRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	blog: blogRouter,
	like: likeRouter,
	user: userRouter,
	follow: followersRouter,
	comment: commentRouter,
	upload: uploadRouter
});


// export type definition of API
export type AppRouter = typeof appRouter;
