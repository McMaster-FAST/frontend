"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

interface CompletionBarProps {
  correct: number;
  total: number;
  className?: string;
}

export function CompletionBar({
  correct,
  total,
  className,
}: CompletionBarProps) {
  // Prevent divide-by-zero if there are no questions
  const percentage = total > 0 ? Math.min((correct / total) * 100, 100) : 0;

  return (
    <div className={cn("flex flex-row items-center gap-3 w-full", className)}>
      <div className="flex items-center justify-center shrink-0 min-w-[24px] h-6">
        <CheckCircle className="size-5 text-maroon-light" strokeWidth={2.5} />
      </div>

      <div className="flex-1">
        <Progress
          value={percentage}
          className="h-1.5 bg-light-gray"
          indicatorClassName="bg-maroon-light duration-1000 ease-out"
        />
      </div>

      <div className="shrink-0 text-xs text-dark-gray font-medium tracking-wide">
        {correct}/{total}
      </div>
    </div>
  );
}
