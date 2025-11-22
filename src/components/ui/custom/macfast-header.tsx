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
import { Label } from "@/components/ui/label";

interface MacFastHeaderProps {
  userId?: string;
  userCourses?: Course[];
}

export function MacFastHeader({ userId, userCourses }: MacFastHeaderProps) {
  return (
    <header className="w-full h-[80px] flex border-b-3 border-gold items-center justify-end px-8 bg-primary text-white">
      <div>
        <a href="/" className="font-semibold text-lg">
          MacFAST
        </a>
      </div>

      <div className="flex-1 flex items-center justify-end gap-2 h-full">
        <NavigationMenu>
          <NavigationMenuList>
            {/* Hide all user related links if not signed in */}
            {userId && (
              <>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>My Courses</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    {userCourses &&
                      userCourses.map((course) => {
                        return (
                          <NavigationMenuLink
                            key={course.code}
                            href={`#/courses/${course.code}`}
                            className="flex flex-col"
                          >
                            <p className="text-md font-medium text-foreground">
                              {course.code}
                            </p>
                            <p className="text-sm font-small text-dark-gray">
                              {course.name}
                            </p>
                          </NavigationMenuLink>
                        );
                      })}
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem className="gap-2">
                  <Label>Signed in as: {userId}</Label>
                  <Button variant="primary">Logout</Button>
                </NavigationMenuItem>
              </>
            )}
            {!userId && (
              <NavigationMenuItem>
                <Button variant="primary">Sign in</Button>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}
