import { randomBytes } from "crypto";
import { z } from "zod";
import { updateRoomData } from "~/pages/api/pusher";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
// import { omit } from "radash";

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

  leave: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session.user.roomCode) return;

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
        data: { playing: false, chooserId: null, word: null, definition: null },
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

  exists: protectedProcedure
    .input(z.object({ roomCode: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.room.findUnique({
        where: { code: input.roomCode },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        difficulty: z.enum(["Easy", "Medium", "Hard"]),
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
      select: { hostId: true, users: { select: { id: true } } },
    });

    if (!room || room.hostId !== ctx.session.user.id) return;

    const chooser = room.users[Math.floor(Math.random() * room.users.length)];

    return await ctx.db.room
      .update({
        where: { code: ctx.session.user.roomCode },
        data: { playing: true, chooserId: chooser?.id },
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
        select: { chooserId: true, fakeDefinitions: true },
      });

      if (room?.chooserId === ctx.session.user.id) return;
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
});
