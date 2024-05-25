import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  findUnique: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return await ctx.db.user.findUnique({
        where: { id: input.userId },
        select: { name: true },
      });
    }),

  currentStats: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.id) return;

    return await ctx.db.user.findUnique({
      select: { gamesPlayed: true, gamesWon: true, highScore: true },
      where: { id: ctx.session.user.id },
    });
  }),

  getTitles: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.id) return;

    return await ctx.db.title.findMany({
      where: { users: { some: { id: ctx.session.user.id } } },
    });
  }),

  obtainTitle: protectedProcedure
    .input(z.object({ titleId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.id) return;

      try {
        // Update the title to add the user
        const updatedTitle = await ctx.db.title.update({
          where: {
            id: input.titleId,
          },
          data: {
            users: {
              connect: {
                id: ctx.session.user.id,
              },
            },
          },
        });

        return updatedTitle;
      } catch (error) {
        console.error("Error updating title:", error);
      }
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
