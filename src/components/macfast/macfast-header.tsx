"use client";

import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { signIn, signOut, useSession } from "next-auth/react";
import { ChevronDown, Loader2, LogOut, Moon, Sun, User } from "lucide-react";
import { useUserCourses } from "@/hooks/useUserCourses";
import { useTheme } from "next-themes";

export function MacFastHeader() {
  const { courses: userCourses, isLoading: isLoadingCourses } =
    useUserCourses();
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  return (
    <header className="z-50 sticky top-0 w-full border-b-3 border-gold bg-primary text-primary-foreground shadow-md">
      <div className="flex h-16 items-center justify-between mx-auto px-3 md:px-6 lg:px-12 w-full">
        <div className="flex items-center gap-4">
          <Image
            src="/images/mcmaster-logo.png"
            alt="McMaster University"
            width={48}
            height={48}
            className="h-11 w-11 object-contain shrink-0"
            priority
            unoptimized
          />
          <Link
            href="/"
            className="font-poppins text-3xl font-bold tracking-tight hover:opacity-90 transition-opacity text-primary-foreground"
          >
            MacFAST
          </Link>
        </div>

        <div className="flex items-center gap-4 w-full justify-end">
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="primary"
                  className="h-9 gap-1 text-primary-foreground hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white group"
                >
                  My Courses
                  <ChevronDown className="h-4 w-4 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-[280px]" align="center">
                <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Active Courses
                </DropdownMenuLabel>

                {isLoadingCourses ? (
                  <div className="flex h-20 items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : userCourses && userCourses.length > 0 ? (
                  userCourses.map((course) => (
                    <DropdownMenuItem
                      key={course.code}
                      asChild
                      className="focus:bg-primary-hover dark:focus:bg-primary"
                    >
                      <Link
                        href={`/courses/${course.code}/coursepage`}
                        className="flex cursor-pointer flex-col items-start gap-1 p-2"
                      >
                        <div className="text-sm font-semibold leading-none">
                          {course.code}
                        </div>
                        <div className="line-clamp-1 text-sm text-muted-foreground">
                          {course.name}
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No courses enrolled.
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {!isLoading && (
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:opacity-80 cursor-pointer"
              aria-label="Toggle theme"
            >
              <Sun className="h-5 w-5 text-gold hidden dark:block" />
              <Moon className="h-5 w-5  dark:hidden" />
            </button>
          )}

          {isLoading ? (
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full bg-white/20" />
              <Skeleton className="hidden md:block h-4 w-24 bg-white/20" />
            </div>
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  className="relative h-9 w-9 rounded-full p-0 ring-offset-background hover:bg-white/10 focus:ring-2 focus:ring-ring focus:ring-offset-2 ml-2"
                >
                  <Avatar className="h-9 w-9 border border-white/20">
                    <AvatarImage
                      src={session?.user?.image || ""}
                      alt={session?.user?.name || ""}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary-foreground text-primary font-bold">
                      {session?.user?.name}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session?.user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session?.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuItem
                  className="text-red-600 dark:text-red-400 cursor-pointer"
                  onClick={() => signOut({ redirectTo: "/" })}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => signIn("microsoft-entra-id")}
              variant="secondary"
              className="ml-2 font-semibold shadow-sm"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
