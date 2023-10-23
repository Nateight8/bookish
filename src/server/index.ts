import { TRPCError } from "@trpc/server";
import prisma from "./db";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { z } from "zod";

export const appRouter = router({
  getFile: privateProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const authUser = ctx.user;

      const dbUser = await prisma.user.findFirst({
        where: {
          email: authUser.email,
        },
      });

      const userId = dbUser?.id;

      const fileExists = prisma.file.findFirst({
        where: { key: input.key, userId },
      });
      if (!fileExists) throw new TRPCError({ code: "NOT_FOUND" });

      return fileExists;
    }),

  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const authUser = ctx.user;

    const dbUser = await prisma.user.findFirst({
      where: {
        email: authUser.email,
      },
    });

    const userId = dbUser?.id;

    return await prisma.file.findMany({
      where: {
        userId,
      },
    });
  }),

  deleteFile: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const authUser = ctx.user;

      const dbUser = await prisma.user.findFirst({
        where: {
          email: authUser.email,
        },
      });

      const userId = dbUser?.id;

      const file = prisma.file.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });

      if (!file) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await prisma.file.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});

export type AppRouter = typeof appRouter;
