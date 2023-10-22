"use client";
import Image from "next/image";
import { trpc } from "./_trpc/client";

export default function Home() {
  const { data } = trpc.test.useQuery();

  return (
    <main className="">
      {" "}
      Server says <span className="text-red-600">{data}</span>
    </main>
  );
}
