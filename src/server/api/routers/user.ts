import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  findUnique: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.id) return;

    return await ctx.db.user.findUnique({
      select: { gamesPlayed: true, gamesWon: true, highScore: true },
      where: { id: ctx.session.user.id },
    });
  }),
});
