"use client";

import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Header() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  return (
    <header className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link href="/" className="text-2xl font-bold">
          Santri & Berita
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          {isSignedIn ? (
            <>
              <Link href="/admin" className="hover:text-gray-300">
                Admin Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <Button onClick={() => router.push("/sign-in")} variant="outline">
              Sign In
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
