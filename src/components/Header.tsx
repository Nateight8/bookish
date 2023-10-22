"use client";
import React from "react";

import Link from "next/link";

import { Button, buttonVariants } from "./ui/button";
import { useSession, signOut, signIn } from "next-auth/react";
import Container from "./ui/Container";

type Props = {};

function Header({}: Props) {
  const { data: session } = useSession();

  const user = session?.user;

  return (
    <nav className="z-40 inset-x-0 top-0 border-border border-b sticky backdrop-blur-lg bg-background/40">
      <Container>
        <div className="flex items-center justify-between  h-14">
          <Link href="/" className="font-semibold text-base">
            quill.
          </Link>

          <div className="hidden sm:flex items-center space-x-4">
            <Link
              href=""
              className={buttonVariants({ size: "sm", variant: "ghost" })}
            >
              Pricing
            </Link>
            {user ? (
              <Button onClick={() => signOut()}>Sign out</Button>
            ) : (
              <>
                <Button onClick={() => signIn()}>Log in</Button>
                <Button>Register</Button>
              </>
            )}
          </div>
        </div>
      </Container>
    </nav>
  );
}

export default Header;
