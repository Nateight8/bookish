"use client";
import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import React from "react";
import UploadDialog from "./components/UploadDialog";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { trpc } from "../_trpc/client";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash } from "lucide-react";

function Page() {
  const utils = trpc.useUtils();

  const { data: files, isLoading } = trpc.getUserFiles.useQuery();

  const { mutate: deleteFile } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate();
    },
  });

  return (
    <main>
      <Container>
        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:gap-0">
          <h1 className="mb-3 font-bold text-5xl ">My Files</h1>

          <UploadDialog />
        </div>

        {/* rendering files here */}
        <>
          {files && files?.length != 0 ? (
            <ul className="py-6 grid gap-4 grid-cols-3">
              {files.map(({ id, name }) => (
                <li key={id}>
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle>Create project</CardTitle>
                      <CardDescription>
                        Deploy your new project in one-click.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className=""></div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t border-border pt-4">
                      <Button variant="outline">Cancel</Button>
                      <Button size={"icon"} onClick={() => deleteFile({ id })}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </li>
              ))}
            </ul>
          ) : isLoading === true ? (
            <div className="flex items-center justify-center min-h-[30rem] w-full">
              <ReloadIcon className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[30rem] w-full">
              <div className="text-center border border-dotted rounded-lg p-8">
                <h1 className="text-lg font-semibold">Welcome to Ghost Town</h1>
                <p className="">because you havnt uploaded any file yet</p>
              </div>
            </div>
          )}
        </>
      </Container>
    </main>
  );
}

export default Page;

function EmptyState() {
  return <div className="flex items-center justify-center"></div>;
}
