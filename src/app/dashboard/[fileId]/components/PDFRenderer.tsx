"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Document, Page, pdfjs } from "react-pdf";
import { zodResolver } from "@hookform/resolvers/zod";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { z } from "zod";
import { cn } from "@/lib/utils";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface Props {
  url: string;
}

function PDFRenderer({ url }: Props) {
  const [PDFPage, setPdfPage] = useState<number>();
  const [currPage, setcurrPage] = useState(1);

  const formSchema = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= PDFPage!),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { page: "1" },
  });

  const handlePageSubmit = function ({ page }) {
    setcurrPage(Number(page));
    setValue("page", String(page));
  };

  return (
    <div className="flex w-full flex-col items-center rounded-md ">
      <div className="h-14 flex w-full border-b border-border items-center justify-between px-2.5">
        <div className="flex items-center justify-center gap-4">
          <Button
            disabled={currPage <= 1}
            onClick={() => setcurrPage((prev) => prev - 1)}
            variant={"outline"}
            size={"icon"}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-2">
            <Input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(handlePageSubmit)();
                }
              }}
              {...register("page")}
              className={cn("w-9 h-9", errors.page && "outline-red-500")}
            />
            <p>
              <span>/</span>
              <span>{PDFPage}</span>
            </p>
          </div>

          <Button
            disabled={currPage === undefined || currPage === PDFPage}
            onClick={() => setcurrPage((prev) => prev + 1)}
            variant={"outline"}
            size={"icon"}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="">
        <Document
          onLoadSuccess={({ numPages }) => setPdfPage(numPages)}
          file={url}
          className={"bg-black text-white"}
        >
          <Page pageNumber={currPage} />
        </Document>
      </div>
    </div>
  );
}

export default PDFRenderer;
