import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { shuffle } from "~/utils/shuffle";
import { z } from "zod";
import { updateRoomData } from "~/pages/api/pusher";

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
        definition: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.roomCode) return;

      const room = await ctx.db.room.findUnique({
        where: {
          code: ctx.session.user.roomCode,
        },
        select: {
          definition: true,
          fakeDefinitions: {
            where: {
              definition: input.definition,
            },
            select: {
              id: true,
              userId: true,
            },
          },
        },
      });

      if (input.definition === room?.definition) {
        await updateRoomData(ctx.session.user.roomCode, ctx.session.user);
        return await ctx.db.room
          .update({
            where: { code: ctx.session.user.roomCode },
            data: {
              correct_voters: { create: { userId: ctx.session.user.id } },
            },
          })
          .then(async (res) => {
            await updateRoomData(res.code, ctx.session.user);
            return res;
          });
      }

      // Check if fake definitions length is 1 because only selecting fake definitions with the definition value set to input.definition
      if (
        room?.fakeDefinitions.length === 1 &&
        room.fakeDefinitions[0]?.userId !== ctx.session.user.id
      ) {
        await updateRoomData(ctx.session.user.roomCode, ctx.session.user);
        return await ctx.db.fakeDefinition.update({
          where: { id: room.fakeDefinitions[0]?.id },
          data: {
            votes: {
              create: {
                userId: ctx.session.user.id,
                roomCode: ctx.session.user.roomCode,
              },
            },
          },
        });
      }

      return null;
    }),

  voteExists: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.vote.findUnique({
      where: {
        userId: ctx.session.user.id,
        roomCode: ctx.session.user.roomCode,
      },
      select: {
        FakeDefinition: {
          select: {
            definition: true,
          },
        },
      },
    });
  }),

  countVotes: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.vote.findMany({
      where: { roomCode: ctx.session.user.roomCode },
      select: { fakeDefinitionId: true },
    });
  }),
});
