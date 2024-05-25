import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const titleRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.title.create({
        data: {
          title: input.title,
        },
      });
    }),

  obtainTitle: protectedProcedure
    .input(z.object({ titleId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.id) return;

      try {
        const updatedTitle = await ctx.db.title.update({
          where: { id: input.titleId },
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
});
