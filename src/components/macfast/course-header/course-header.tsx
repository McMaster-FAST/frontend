"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, LayoutDashboard, Pencil } from "lucide-react";

interface CourseBannerProps {
  course: any;
  isLoading: boolean;
  error: any;
  variant?: "instructor" | "course" | "question-edit";
  xpLevel?: number; // Only needed if variant is "course"
}

export function CourseBanner({
  course,
  isLoading,
  error,
  variant = "course", // Default to the standard course view
  xpLevel,
}: CourseBannerProps) {
  return (
    <div className="border-b border-light-gray bg-white px-6 py-8 shadow-sm">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4">
          <div>
            <div className="mb-2 flex w-full items-center gap-2">
              <Badge variant="secondary" className="font-bold text-dark-gray">
                {isLoading || !course ? (
                  <Skeleton className="h-4 w-20" />
                ) : error ? (
                  <span>Unavailable</span>
                ) : (
                  course.code
                )}
              </Badge>

              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {isLoading || !course ? (
                  <Skeleton className="h-4 w-20" />
                ) : error ? null : (
                  course.semester
                )}
              </span>

              {/* --- DYNAMIC RIGHT SIDE BASED ON VARIANT --- */}

              {variant === "instructor" && (
                <Badge
                  variant="secondary"
                  className="ml-auto font-bold text-dark-gray"
                >
                  <LayoutDashboard className="mr-1 inline-block h-4 w-4 text-dark-gray" />
                  Instructor Dashboard
                </Badge>
              )}

              {variant === "course" && xpLevel !== undefined && (
                <div
                  className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 border-2 border-blue-200 text-sm font-bold text-blue-700 shadow-sm"
                  title={`XP Level: ${xpLevel}`}
                >
                  {xpLevel}
                </div>
              )}

              {variant === "question-edit" && (
                <Badge className="ml-auto font-bold border-orange-200 bg-orange-50 text-orange-700">
                  <Pencil className="mr-1 inline-block h-4 w-4" />
                  Editing Question
                </Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold text-foreground">
              {isLoading || !course ? (
                <Skeleton className="h-16 w-[120px]" />
              ) : error ? (
                <span className="text-red-900">
                  <AlertTriangle className="mr-2 inline-block" />
                  Error loading course
                </span>
              ) : (
                course.name
              )}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
