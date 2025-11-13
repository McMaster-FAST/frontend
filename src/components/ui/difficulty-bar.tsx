"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

interface DifficultyBarProps extends React.HTMLAttributes<HTMLDivElement> {
  difficulty: number;
  maxDifficulty?: number;
  showLabel?: boolean;
}

function DifficultyBar({
  difficulty,
  maxDifficulty = 100,
  showLabel = true,
  className,
  ...props
}: DifficultyBarProps) {
  const percentage = (difficulty / maxDifficulty) * 100;

  return (
    <div className={cn("w-full", className)} {...props}>
      {showLabel && (
        <span className="text-sm text-dark-gray">
          Difficulty: {(difficulty / maxDifficulty).toFixed(2)}
        </span>
      )}
      <div className="h-1 bg-light-gray rounded-full overflow-hidden">
        <div
          className="h-full bg-gold transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export { DifficultyBar };
