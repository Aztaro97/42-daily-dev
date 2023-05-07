import { createTRPCRouter } from "@/server/api/trpc";
import { blogRouter } from "./routers/blogRouter";
import { likeRouter } from "./routers/likeRouter";
import { userRouter } from "./routers/userRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	blog: blogRouter,
	like: likeRouter,
	user: userRouter,
});


// export type definition of API
export type AppRouter = typeof appRouter;
