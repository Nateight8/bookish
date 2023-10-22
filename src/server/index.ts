import { publicProcedure, router } from "./trpc";
export const appRouter = router({
  test: publicProcedure.query(() => {
    return "hello from server";
  }),
});

export type AppRouter = typeof appRouter;
