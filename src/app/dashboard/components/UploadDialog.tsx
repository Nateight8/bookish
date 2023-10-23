"use client";
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/lib/generateReactHelper";
import { FileIcon } from "@radix-ui/react-icons";
import { Cloud, CloudIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Dropzone from "react-dropzone";

type Props = {};

function UploadDialog({}: Props) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Upload File</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <UploadDropzone />

          <DialogFooter>
            <Button
              variant={"outline"}
              onClick={() => handleOpen()}
              type="submit"
              className="w-full"
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default UploadDialog;

function UploadDropzone() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setuploadProgress] = useState(0);

  const { startUpload } = useUploadThing("imageUploader");

  const progressSimulation = function () {
    setuploadProgress(0);

    const interval = setInterval(() => {
      setuploadProgress((e) => {
        if (e >= 95) {
          clearInterval(interval);
          return e;
        }
        return e + 5;
      });
    }, 500);

    return interval;
  };
  const router = useRouter();
  const { mutate: start } = trpc.getFile.useMutation({
    onSuccess: (file) => {
      router.push(`/dashboard/${file?.id}`);
    },
    retry: true,
    retryDelay: 500,
  });

  return (
    <Dropzone
      multiple={false}
      onDrop={async (acceptedFiles) => {
        setIsUploading(true);

        const res = await startUpload(acceptedFiles);
        if (!res) {
          toast({
            title: "Something went wrong",
            description: "please try again",
            variant: "destructive",
          });
        }

        const [fileResponse] = res;
        const key = fileResponse?.key;

        const startSimulation = progressSimulation();

        // await new Promise((resolve) => setTimeout(resolve, 10000));

        clearInterval(startSimulation);
        setuploadProgress(100);

        start({ key });
      }}
    >
      {({ acceptedFiles, getRootProps, getInputProps }) => (
        <div
          {...getRootProps()}
          className="h-64 border border-border m-4 border-dashed rounded-lg"
        >
          <div className="h-full w-full flex items-center justify-center">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center rounded-lg w-full h-full bg-muted/10 transition-all duration-1000 ease-in-out hover:bg-muted/40"
            >
              <div className="flex items-center justify-center flex-col">
                <CloudIcon className="h-6 w-6" />
                <p>Upload a PDF</p>
              </div>

              {acceptedFiles && acceptedFiles[0] && (
                <div className="max-w-xs flex bg-muted/40 overflow-hidden items-center p-1 my-4 rounded-md divide-x divide-border ">
                  <div className=" ">
                    <FileIcon className="h-4 w-4" />
                  </div>
                  <p className="px-2 truncate whitespace-nowrap text-xs">
                    {acceptedFiles[0].name}
                  </p>
                </div>
              )}

              {isUploading ? (
                <div className="max-w-xs w-full mx-auto mt-4">
                  <Progress value={uploadProgress} className="w-full h-[2px]" />
                </div>
              ) : null}

              {uploadProgress === 100 && (
                <div className="flex items-center">
                  <Loader2 className="mr-1 animate-spin h-4 w-4" />
                  Redirecting...
                </div>
              )}
              <input
                type="file"
                {...getInputProps}
                id="dropzone-file"
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
}
