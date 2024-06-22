import { randomBytes } from "crypto";
import { z } from "zod";
import { kickUser, updateRoomData } from "~/pages/api/pusher";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

type Omit = <T extends object, K extends [...(keyof T)[]]>(
  obj: T,
  ...keys: K
) => {
  [K2 in Exclude<keyof T, K[number]>]: T[K2];
};

const omit: Omit = (obj, ...keys) => {
  const ret = {} as {
    [K in keyof typeof obj]: (typeof obj)[K];
  };
  let key: keyof typeof obj;
  for (key in obj) {
    if (!keys.includes(key)) {
      ret[key] = obj[key];
    }
  }
  return ret;
};

export const roomRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.session.user.roomCode) return;

    let code;
    do {
      code = randomBytes(2).toString("hex").toUpperCase();
    } while (await ctx.db.room.findUnique({ where: { code: code } }));

    return await ctx.db.room.create({
      data: {
        code,
        users: { connect: { id: ctx.session.user.id } },
        hostId: ctx.session.user.id,
      },
    });
  }),

  join: protectedProcedure
    .input(z.object({ roomCode: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.roomCode) return;

      return await ctx.db.room
        .update({
          where: { code: input.roomCode },
          data: { users: { connect: { id: ctx.session.user.id } } },
        })
        .then(async (res) => {
          await updateRoomData(res.code, ctx.session.user);
          return res;
        });
    }),

  leave: protectedProcedure
    .input(z.object({ id: z.string() }).optional())
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.roomCode) return;

      await ctx.db.vote.deleteMany({
        where: { userId: ctx.session.user.id },
      });

      if (input?.id) {
        const findHost = await ctx.db.room.findUnique({
          select: { hostId: true },
          where: { code: ctx.session.user.roomCode },
        });

        if (findHost?.hostId === ctx.session.user.id) {
          return ctx.db.user
            .update({
              where: { id: input.id },
              data: { Room: { disconnect: true }, score: 0 },
            })
            .then(async (r) => {
              await updateRoomData(
                ctx.session.user.roomCode!,
                ctx.session.user,
              );
              await kickUser(ctx.session.user.roomCode!, input.id);
              return r;
            });
        }
        return;
      }

      let roomUpdate = await ctx.db.room.update({
        where: { code: ctx.session.user.roomCode },
        data: { users: { disconnect: { id: ctx.session.user.id } } },
        select: { users: { select: { id: true } }, hostId: true },
      });

      if (roomUpdate.users.length === 0) {
        await ctx.db.vote.deleteMany({
          where: { roomCode: ctx.session.user.roomCode },
        });
        await ctx.db.fakeDefinition.deleteMany({
          where: { roomCode: ctx.session.user.roomCode },
        });
        return await ctx.db.room.delete({
          where: { code: ctx.session.user.roomCode },
        });
      }

      if (roomUpdate.hostId === ctx.session.user.id) {
        roomUpdate = await ctx.db.room.update({
          where: { code: ctx.session.user.roomCode },
          data: { hostId: roomUpdate.users[0]?.id },
          select: { users: { select: { id: true } }, hostId: true },
        });
      }

      if (roomUpdate.users.length <= 2) {
        await ctx.db.vote.deleteMany({
          where: { roomCode: ctx.session.user.roomCode },
        });
        await ctx.db.fakeDefinition.deleteMany({
          where: { roomCode: ctx.session.user.roomCode },
        });
        roomUpdate = await ctx.db.room.update({
          where: { code: ctx.session.user.roomCode },
          data: {
            playing: false,
            chooserId: null,
            word: null,
            definition: null,
          },
          select: { users: { select: { id: true } }, hostId: true },
        });
      }

      await updateRoomData(ctx.session.user.roomCode, ctx.session.user);
      return roomUpdate;
    }),

  findUnique: protectedProcedure
    .input(z.object({ roomCode: z.string() }))
    .query(async ({ ctx, input }) => {
      const room = await ctx.db.room.findUnique({
        where: { code: input.roomCode },
        include: {
          users: {
            select: { id: true, name: true, image: true },
          },
          fakeDefinitions: true,
          correct_voters: true,
        },
      });

      if (!room) return;

      return omit<typeof room, ["definition"]>(room, "definition");
    }),

  getRoundResults: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.roomCode) return;

    const room = await ctx.db.room.findUnique({
      where: { code: ctx.session.user.roomCode },
      select: {
        word: true,
        definition: true,
        correct_voters: true,
        fakeDefinitions: {
          select: {
            votes: true,
            definition: true,
            userId: true,
          },
        },
        users: {
          select: {
            score: true,
            name: true,
            image: true,
          },
          orderBy: { score: "desc" },
          take: 5,
        },
      },
    });

    if (!room) return;

    const fakeVotes = room.fakeDefinitions.map((def) => def.votes.length);
    const mostChosenDefinition =
      room.correct_voters.length >= Math.max(...fakeVotes)
        ? room.definition
        : room.fakeDefinitions.find(
            (def) => def.votes.length === Math.max(...fakeVotes),
          )?.definition;

    return {
      realWord: room.word,
      realDefinition: room.definition,
      mostChosenDefinition: mostChosenDefinition,
      currentUserDefinition: room.fakeDefinitions.find(
        (def) => def.userId === ctx.session.user.id,
      )?.definition,
      topFive: room.users,
    };
  }),

  exists: protectedProcedure
    .input(z.object({ roomCode: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.room.findUnique({
        select: { playing: true },
        where: { code: input.roomCode },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        rounds: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.roomCode) return;

      const room = await ctx.db.room.findUnique({
        where: { code: ctx.session.user.roomCode },
        select: { hostId: true },
      });

      if (room?.hostId !== ctx.session.user.id) return;

      return await ctx.db.room
        .update({
          where: { code: ctx.session.user.roomCode },
          data: { ...input },
        })
        .then(async (res) => {
          await updateRoomData(res.code, ctx.session.user);
          return res;
        });
    }),

  startGame: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session.user.roomCode) return;

    const room = await ctx.db.room.findUnique({
      where: { code: ctx.session.user.roomCode },
      select: {
        hostId: true,
        hostPlays: true,
        users: { select: { id: true } },
      },
    });

    if (!room || room.hostId !== ctx.session.user.id) return;

    let chooser;
    do {
      chooser = room.users[Math.floor(Math.random() * room.users.length)];
    } while (!room.hostPlays && room.hostId === chooser?.id);

    await ctx.db.user.updateMany({
      where: { roomCode: ctx.session.user.roomCode },
      data: { score: 0 },
    });

    return await ctx.db.room
      .update({
        where: { code: ctx.session.user.roomCode },
        data: {
          playing: true,
          chooserId: chooser?.id,
          currentRound: 1,
        },
      })
      .then(async (res) => {
        await updateRoomData(res.code, ctx.session.user);
        return res;
      });
  }),

  nextRound: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session.user.roomCode) return;

    const room = await ctx.db.room.findUnique({
      where: { code: ctx.session.user.roomCode },
      select: {
        hostId: true,
        chooserId: true,
        users: { select: { id: true } },
        currentRound: true,
        rounds: true,
        hostPlays: true,
      },
    });

    if (
      !room ||
      room.hostId !== ctx.session.user.id ||
      room.currentRound === room.rounds
    )
      return;

    let chooser;
    do {
      chooser = room.users[Math.floor(Math.random() * room.users.length)];
    } while (
      room.chooserId === chooser?.id ||
      (!room.hostPlays && room.hostId === chooser?.id)
    );

    await ctx.db.vote.deleteMany({
      where: { roomCode: ctx.session.user.roomCode },
    });
    await ctx.db.fakeDefinition.deleteMany({
      where: { roomCode: ctx.session.user.roomCode },
    });

    return await ctx.db.room
      .update({
        where: { code: ctx.session.user.roomCode },
        data: {
          word: null,
          definition: null,
          chooserId: chooser?.id,
          currentRound: { increment: 1 },
        },
      })
      .then(async (res) => {
        await updateRoomData(res.code, ctx.session.user);
        return res;
      });
  }),

  chooseWord: protectedProcedure
    .input(
      z.object({
        word: z.string(),
        definition: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.roomCode) return;

      const room = await ctx.db.room.findUnique({
        where: { code: ctx.session.user.roomCode },
        select: { chooserId: true },
      });

      if (room?.chooserId !== ctx.session.user.id) return;

      return await ctx.db.room
        .update({
          where: { code: ctx.session.user.roomCode },
          data: { ...input },
        })
        .then(async (res) => {
          await updateRoomData(res.code, ctx.session.user);
          return res;
        });
    }),

  submitDefinition: protectedProcedure
    .input(
      z.object({
        definition: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.roomCode) return;

      const room = await ctx.db.room.findUnique({
        where: { code: ctx.session.user.roomCode },
        select: {
          chooserId: true,
          fakeDefinitions: true,
          hostPlays: true,
          hostId: true,
        },
      });

      if (
        room?.chooserId === ctx.session.user.id ||
        (!room?.hostPlays && room?.hostId === ctx.session.user.id)
      )
        return;
      if (
        room?.fakeDefinitions.map((d) => d.userId).includes(ctx.session.user.id)
      )
        return;

      return await ctx.db.room
        .update({
          where: { code: ctx.session.user.roomCode },
          data: {
            fakeDefinitions: {
              create: {
                definition: input.definition,
                userId: ctx.session.user.id,
              },
            },
          },
        })
        .then(async (res) => {
          await updateRoomData(res.code, ctx.session.user);
          return res;
        });
    }),

  endGame: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session.user.roomCode) return;

    const room = await ctx.db.room.findUnique({
      where: { code: ctx.session.user.roomCode },
      select: { hostId: true, users: { select: { id: true } } },
    });

    if (!room || room.hostId !== ctx.session.user.id) return;

    await ctx.db.vote.deleteMany({
      where: { roomCode: ctx.session.user.roomCode },
    });
    await ctx.db.fakeDefinition.deleteMany({
      where: { roomCode: ctx.session.user.roomCode },
    });

    await ctx.db.room
      .update({
        where: { code: ctx.session.user.roomCode },
        data: {
          playing: false,
          currentRound: 0,
          chooserId: null,
          definition: null,
          word: null,
        },
      })
      .then(async (res) => {
        await updateRoomData(res.code, ctx.session.user);
        return res;
      });

    // UNTIL PRISMA ISSUE #19442 IS FIXED, THIS IS THE BEST WAY TO DO THIS
    const users = await ctx.db.user.findMany({
      where: {
        highScore: {
          lt: ctx.db.user.fields.score,
        },
      },
      select: {
        id: true,
        score: true,
      },
    });

    for (const user of users) {
      await ctx.db.user.update({
        where: {
          id: user.id,
        },
        data: {
          highScore: user.score,
          gamesPlayed: {
            increment: 1,
          },
        },
      });
    }
    // -------------------------------------------
  }),
});
