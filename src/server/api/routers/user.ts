import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  findUnique: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.id) return;

    return await ctx.db.user.findUnique({
      select: { gamesPlayed: true, gamesWon: true, highScore: true },
      where: { id: ctx.session.user.id },
    });
  }),

  update: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { ...input },
      });
    }),

  didWriteDefinition: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.id || !ctx.session.user.roomCode) return;

    return await ctx.db.fakeDefinition.findUnique({
      where: {
        roomCode_userId: {
          userId: ctx.session.user.id,
          roomCode: ctx.session.user.roomCode,
        },
      },
    });
  }),
});
