import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { TRPCError, initTRPC } from "@trpc/server";
import { getServerSession } from "next-auth";

const t = initTRPC.create();
const middleware = t.middleware;

const isAuthUserMiddleware = middleware(async (option) => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return option.next({
    ctx: {
      user,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuthUserMiddleware);
