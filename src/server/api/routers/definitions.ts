import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { shuffle } from "~/utils/shuffle";
import { z } from "zod";

export const definitionsRouter = createTRPCRouter({
  getDefinitionsForVoting: protectedProcedure.query(async ({ ctx }) => {
    const room = await ctx.db.room.findUnique({
      where: {
        code: ctx.session.user.roomCode,
      },
      select: {
        definition: true,
        fakeDefinitions: {
          where: {
            NOT: {
              userId: ctx.session.user.id,
            },
          },
          select: {
            definition: true,
          },
        },
      },
    });

    if (!room) return;

    const defs = [
      room.definition,
      ...room.fakeDefinitions.map((fd) => fd.definition),
    ];

    shuffle(defs);

    return defs;
  }),

  voteForDefinition: protectedProcedure
    .input(
      z.object({
        definitionId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.roomCode) return;

      if (!input.definitionId) {
        return await ctx.db.room.update({
          where: { code: ctx.session.user.roomCode },
          data: {},
        });
      }

      return await ctx.db.room.update({
        where: { code: ctx.session.user.roomCode },
        data: {
          fakeDefinitions: {
            create: {
              definition: input.definition,
              userId: ctx.session.user.id,
            },
          },
        },
      });
    }),
});
