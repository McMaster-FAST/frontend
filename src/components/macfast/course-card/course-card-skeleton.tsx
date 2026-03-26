import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Tried AI generating this, worked pretty well imo

export function CourseCardSkeleton() {
  return (
    <Card className="flex w-full flex-col overflow-hidden border-light-gray dark:border-dark-gray bg-card">
      {/* Top Banner Area */}
      <div className="h-40 bg-muted/30 p-4 flex justify-between items-start">
        {/* Badge Skeleton */}
        <Skeleton className="h-6 w-16 rounded-full" />
        {/* Year Skeleton */}
        <Skeleton className="h-4 w-12" />
      </div>

      <CardHeader className="pb-2 pt-4 space-y-2">
        {/* Title Skeleton (Mimicking 2 lines) */}
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-[70%]" />
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        {/* Semester Row Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Description Skeleton (Mimicking 3 lines) */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[85%]" />
        </div>

        {/* Progress Bar Skeleton */}
        <div className="mt-auto space-y-2 pt-2">
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 border-t border-dark-gray-50 bg-dark-gray-50/50 p-4">
        {/* Button Skeletons */}
        <Skeleton className="h-9 flex-1 rounded-md" />
        <Skeleton className="h-9 flex-1 rounded-md" />
      </CardFooter>
    </Card>
  );
}
