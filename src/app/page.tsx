"use client";
// import { getServerSession } from "next-auth";
import Image from "next/image";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { useSession, signOut } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();

  const user = session?.user;
  const router = useRouter();

  if (user) {
    router.push("/dashboard");
  }

  // console.log(data);

  return <main className="text-slate-100"></main>;
}
