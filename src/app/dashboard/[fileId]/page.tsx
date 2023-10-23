import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Container from "@/components/ui/Container";
import prisma from "@/server/db";
import { getServerSession } from "next-auth/next";
import { notFound, redirect } from "next/navigation";
import React from "react";
import PDFRenderer from "./components/PDFRenderer";

interface Props {
  params: {
    fileId: string;
  };
}

async function Page({ params }: Props) {
  const { fileId } = params;
  const session = await getServerSession(authOptions);

  // if (session?.user) redirect(`/api/auth/signin?origin=dashboard/${fileId}`);

  // get the user id that matches email from db

  const user = session?.user;

  const matchedUser = await prisma.user.findFirst({
    where: {
      email: user?.email,
    },
  });

  const file = await prisma.file.findFirst({
    where: {
      id: fileId,
      userId: matchedUser?.id,
    },
  });

  if (!file) notFound();

  return (
    <div className="flex items-center justify-center min-h-[90vh]">
      <Container>
        <div className="border border-border w-full  lg:flex">
          <div className="flex-1 xl:flex">
            <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
              <PDFRenderer url={file.url} />
            </div>
          </div>
          <div className="shrink-0 flex-[0.75] border-t border-border lg:w-96 lg:border-l lg:border-t-0 min-h-[80vh]"></div>
        </div>
      </Container>
    </div>
  );
}

export default Page;
