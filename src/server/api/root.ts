import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { roomRouter } from "./routers/room";
import { userRouter } from "./routers/user";
import { definitionsRouter } from "./routers/definitions";
import { titleRouter } from "./routers/title";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  room: roomRouter,
  user: userRouter,
  definitions: definitionsRouter,
  title: titleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
