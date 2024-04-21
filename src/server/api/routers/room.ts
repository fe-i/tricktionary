/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// import { TRPCError } from "@trpc/server";
import { randomBytes } from "crypto";
// import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  // publicProcedure,
} from "~/server/api/trpc";

export const roomRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.session.user.roomCode) return;
    //   throw new TRPCError({
    //     code: "CONFLICT",
    //     message: "You are already in a room.",
    //   });

    let code;
    do {
      code = randomBytes(2).toString("hex").toLowerCase();
    } while (await ctx.db.room.findUnique({ where: { code: code } }));

    return await ctx.db.room.create({
      data: {
        code,
        users: { connect: { id: ctx.session.user.id } },
      },
    });
  }),
});
