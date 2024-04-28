// import { TRPCError } from "@trpc/server";
import { randomBytes } from "crypto";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  //   publicProcedure,
} from "~/server/api/trpc";

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
      },
    });
  }),

  join: protectedProcedure
    .input(z.object({ roomCode: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.roomCode) return;
      console.log("hello");

      return await ctx.db.room.update({
        where: {
          code: input.roomCode,
        },
        data: {
          users: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  leaveRoom: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session.user.roomCode) return;

    const roomUpdate = await ctx.db.room.update({
      where: {
        code: ctx.session.user.roomCode,
      },
      data: {
        users: { disconnect: { id: ctx.session.user.id } },
      },
      include: {
        users: true,
      },
    });

    if (roomUpdate.users.length === 0) {
      return await ctx.db.room.delete({
        where: {
          code: ctx.session.user.roomCode,
        },
      });
    } else {
      return roomUpdate;
    }
  }),

  findUnique: protectedProcedure
    .input(z.object({ roomCode: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.room.findUnique({
        where: { code: input.roomCode },
      });
    }),
  exists: protectedProcedure
    .input(z.object({ roomCode: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.room.findUnique({
        where: { code: input.roomCode },
      });
    }),
});
