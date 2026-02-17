"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signIn, signOut, useSession } from "next-auth/react";

const nav = [
  { href: "/", label: "Dashboard" },
  { href: "/cycles", label: "Cycles" },
  { href: "/goals", label: "Goals" },
  { href: "/check-in", label: "Weekly Check-in" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { data } = useSession();

  return (
    <header className="bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold tracking-tight">
            Goals
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-muted-foreground hover:text-foreground hover:bg-accent rounded-md px-3 py-1.5 text-sm transition-colors",
                  pathname === item.href &&
                    "text-foreground bg-accent font-medium",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!data?.user ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => signIn("google", { callbackUrl: "/" })}
              >
                Sign in with Google
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  signIn("microsoft-entra-id", { callbackUrl: "/" })
                }
              >
                Microsoft
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 px-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={data.user.image ?? undefined} />
                    <AvatarFallback>
                      {(data.user.name ?? data.user.email ?? "U")
                        .slice(0, 1)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm leading-none font-medium">
                      {data.user.name}
                    </p>
                    <p className="text-muted-foreground text-xs leading-none">
                      {data.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
