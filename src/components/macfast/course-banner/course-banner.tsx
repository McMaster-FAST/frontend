"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { AlertTriangle, LayoutDashboard, Pencil } from "lucide-react";
import { XpCircle } from "../xp-circle/xp-circle";

interface CourseBannerProps {
  course: Course | undefined;
  isLoading: boolean;
  error: any;
  variant?: "instructor" | "course" | "question-edit";
  level?: number;
  progressPercentage?: number; // 0-100
}

export function CourseBanner({
  course,
  isLoading,
  error,
  variant = "course",
  level = 0,
  progressPercentage = 0,
}: CourseBannerProps) {
  const isCourseVariant = variant === "course";

  return (
    <div className="border-b border-muted-foreground bg-background px-6 py-8 shadow-sm">
      <div className="mx-auto max-w-7xl">
        <div
          className={cn("flex flex-col gap-4", {
            "flex-row items-center justify-between gap-10": isCourseVariant,
          })}
        >
          {/* Main Text Content Column */}
          <div
            className={cn("flex-1", {
              "flex flex-col gap-1": isCourseVariant,
            })}
          >
            <div className="mb-2 flex w-full items-center gap-2">
              <Badge variant="secondary" className="font-bold text-foreground">
                {isLoading || !course ? (
                  <Skeleton className="h-4 w-20" />
                ) : error ? (
                  <span>Unavailable</span>
                ) : (
                  course.code
                )}
              </Badge>

              <span className="text-xs font-medium uppercase tracking-wider text-foreground">
                {isLoading || !course ? (
                  <Skeleton className="h-4 w-20" />
                ) : error ? null : (
                  course.semester
                )}
              </span>

              {!isCourseVariant && variant === "instructor" && (
                <Badge
                  variant="secondary"
                  className="ml-auto font-bold text-foreground"
                >
                  <LayoutDashboard className="mr-1 inline-block h-4 w-4 text-foreground" />
                  Instructor Dashboard
                </Badge>
              )}

              {!isCourseVariant && variant === "question-edit" && (
                <Badge
                  variant="secondary"
                  className="ml-auto font-bold text-foreground"
                >
                  <Pencil className="mr-1 inline-block h-4 w-4 text-foreground" />
                  Editing Question
                </Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold text-foreground">
              {isLoading || !course ? (
                <Skeleton className="h-10 w-64" />
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

          {isCourseVariant && (
            <XpCircle
              level={level}
              percentage={progressPercentage}
              isLoading={isLoading}
              className="w-24 h-24 flex-shrink-0"
            />
          )}
        </div>
      </div>
    </div>
  );
}
