"use client";
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
import React, { useState } from "react";

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
          <DialogHeader>
            <DialogTitle>Upload PDF File</DialogTitle>
            <DialogDescription>
              Upload a PDF file to start a conversation with your document.
            </DialogDescription>
          </DialogHeader>
          <div className="my-6 min-h-[10rem] w-full"></div>
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
