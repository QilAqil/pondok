"use client";

import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";

const Navbar = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  return (
    <div >
      <nav className="h-16 bg-background border-b">
        <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <Logo />

          {/* Desktop Menu */}
          <NavMenu className="hidden md:block" />

          <div className="flex items-center gap-3">
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

            {/* Mobile Menu */}
            <div className="md:hidden">
              <NavigationSheet />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
