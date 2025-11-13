"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  caption?: string;
}

function Progress({
  className,
  value,
  caption,
  ...props
}: ProgressProps) {
  return (
    <>
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-dark-gray relative h-2 overflow-hidden",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-gold h-full flex-1 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
    <p className="text-sm text-dark-gray">{caption}</p>
    </>
  )
}

export { Progress }
