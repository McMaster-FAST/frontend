"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { signIn, signOut, useSession } from "next-auth/react";
import { Course } from "@/lib/temp/questionData";

interface MacFastHeaderProps {
  userCourses?: Course[];
}

export function MacFastHeader({ userCourses }: MacFastHeaderProps) {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  return (
    <header className="w-full h-[80px] flex border-b-[3px] border-gold items-center justify-end px-8 bg-primary text-white flex-none">
      <div>
        <a
          href="/"
          className="font-bold font-poppins text-xl hover:opacity-80 transition-opacity"
        >
          MacFAST
        </a>
      </div>

      <div className="flex-1 flex items-center justify-end gap-2 h-full">
        <NavigationMenu>
          <NavigationMenuList className="gap-4">
            {/* Hide all user related links if not signed in */}
            {isAuthenticated && (
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-base text-white hover:text-primary">
                  My Courses
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="flex flex-col gap-2 p-4 w-[200px]">
                    {userCourses && userCourses.length > 0 ? (
                      userCourses.map((course) => (
                        <NavigationMenuLink
                          key={course.code}
                          href={`/courses/${course.code}/dashboard`}
                          className="block p-2 hover:bg-slate-100 rounded-md"
                        >
                          <p className="text-sm font-bold text-foreground">
                            {course.code}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {course.name}
                          </p>
                        </NavigationMenuLink>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground p-2">
                        No courses found
                      </p>
                    )}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )}

            <NavigationMenuItem className="flex items-center gap-4">
              {isLoading ? (
                // State 1: Loading
                <Skeleton className="w-[100px] h-[40px] rounded-md bg-slate-200/20" />
              ) : isAuthenticated ? (
                // State 2: Logged In
                <>
                  <span className="text-base hidden md:inline-block">
                    Signed in as,&nbsp;
                    <span className="font-bold">{session.user?.name}</span>
                  </span>
                  <Button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    variant="secondary"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                // State 3: Logged Out
                <Button
                  onClick={() => signIn("auth0")}
                  variant="secondary" // Changed to secondary so it pops against the primary header (it still doesn't really)
                >
                  Sign In
                </Button>
              )}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}
