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
import { Expand } from "lucide-react";
import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import SimpleBar from "simplebar-react";

interface Props {
  url: string;
}

function PDFExpand({ url }: Props) {
  const [PdfPage, setPdfPage] = useState<Number>();
  const [numPages, setnumPages] = useState<Number>();

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size={"icon"}>
            <Expand className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-7xl w-full ">
          <SimpleBar className="mt-6 max-h-[calc(100vh - 10rem)]">
            <div className="">
              <div className="">
                <Document
                  onLoadSuccess={({ numPages }) => setPdfPage(numPages)}
                  file={url}
                  className={"bg-black text-white"}
                >
                  {new Array(numPages).fill(0).map((_, i) => (
                    <Page key={i} pageNumber={i + 1} />
                  ))}
                </Document>
              </div>
            </div>
          </SimpleBar>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PDFExpand;
