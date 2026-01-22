"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

interface ProgressProps extends React.ComponentProps<
  typeof ProgressPrimitive.Root
> {
  caption?: string;
  value?: number | null;
}

function Progress({ className, value, caption, ...props }: ProgressProps) {
  const isUnattempted = value === undefined || value === null;

  return (
    <div className="flex flex-col gap-1">
      <ProgressPrimitive.Root
        data-slot="progress"
        className={cn(
          "relative h-2 overflow-hidden rounded-full",
          isUnattempted
            ? "bg-transparent border border-dashed border-light-gray"
            : "bg-light-gray",
          className,
        )}
        {...props}
      >
        {!isUnattempted && (
          <ProgressPrimitive.Indicator
            data-slot="progress-indicator"
            className="bg-gold h-full flex-1 transition-all"
            style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
          />
        )}

        {isUnattempted && (
          <div className="absolute inset-0 opacity-[0.2] bg-[repeating-linear-gradient(45deg,var(--dark-gray),var(--dark-gray)_10px,var(--light-gray)_10px,var(--light-gray)_20px)]" />
        )}
      </ProgressPrimitive.Root>

      {caption && (
        <p className="text-sm text-dark-gray flex justify-between">
          <span>{caption}</span>
        </p>
      )}
    </div>
  );
}

export { Progress };
