import { getServerSession } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/server/db";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" });

export const ourFileRouter = {
  imageUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const session = await getServerSession(authOptions);
      const user = session?.user;
      const userMatched = await prisma.user.findFirst({
        where: {
          email: user?.email,
        },
      });
      //   const user = await auth(req);

      if (!user) throw new Error("Unauthorized");

      return { userId: userMatched?.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const isFileExist = await prisma.file.findFirst({
        where: {
          key: file.key,
        },
      });

      if (isFileExist) return;

      const createdFile = await prisma.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
          status: "PROCESSING",
        },
      });
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
