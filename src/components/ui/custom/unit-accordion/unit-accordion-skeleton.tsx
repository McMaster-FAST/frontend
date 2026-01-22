import { Skeleton } from "@/components/ui/skeleton";

export function UnitsAccordionSkeleton() {
  return (
    <div className="w-full flex flex-col gap-4">
      {[1, 2, 3, 4, 5].map((index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm"
        >
          <div className="w-full max-w-[75%] space-y-2">
            <Skeleton className="h-5 w-48 rounded-md" />
            <div className="flex flex-col gap-1 pt-1">
              <Skeleton className="h-2 w-full rounded-full" />
              <Skeleton className="h-3 w-16 rounded-md" />
            </div>
          </div>
          <Skeleton className="h-9 w-24 shrink-0 rounded-md" />
        </div>
      ))}
    </div>
  );
}
