import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

type Props = {
  className?: string;
  children?: ReactNode;
};

function Container({ children, className }: Props) {
  return (
    <div
      className={cn(
        "mx-auto max-w-screen-xl w-full px-2.5 md:px-20 ",
        className
      )}
    >
      {children}
    </div>
  );
}

export default Container;
