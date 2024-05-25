import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { shuffle } from "~/utils/shuffle";

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

  //   voteForDefinition:
});
