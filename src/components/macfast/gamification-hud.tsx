"use client";

import { cn } from "@/lib/utils";
import { Gamification, DifficultyLabel } from "@/types/Gamification";
import { Flame, ShieldCheck, Minus, Zap } from "lucide-react";

interface GamificationHUDProps {
  gamification: Gamification;
  className?: string;
}

const difficultyConfig: Record<
  DifficultyLabel,
  { label: string; icon: React.ReactNode; classes: string }
> = {
  MUCH_EASIER: {
    label: "Much Easier",
    icon: <ShieldCheck className="h-4 w-4" />,
    classes:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
  },
  EASIER: {
    label: "Easier",
    icon: <ShieldCheck className="h-4 w-4" />,
    classes:
      "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800",
  },
  ON_TARGET: {
    label: "On Target",
    icon: <Minus className="h-4 w-4" />,
    classes:
      "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
  },
  HARDER: {
    label: "Harder",
    icon: <Flame className="h-4 w-4" />,
    classes:
      "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800",
  },
  MUCH_HARDER: {
    label: "Much Harder",
    icon: <Zap className="h-4 w-4" />,
    classes:
      "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800",
  },
};

function abilityToPercent(ability: number): number {
  return Math.round(((ability + 3) / 6) * 100);
}

function abilityBarColor(ability: number): string {
  if (ability >= 1) return "bg-green-500";
  if (ability >= -1) return "bg-amber-400";
  return "bg-red-500";
}

function confidenceLabel(variance: number): string {
  if (variance <= 1) return "High confidence";
  if (variance <= 3) return "Moderate confidence";
  return "Still calibrating…";
}

export function GamificationHUD({
  gamification,
  className,
}: GamificationHUDProps) {
  const { user_ability, ability_variance, current_streak, difficulty_label } =
    gamification;

  const abilityPct = abilityToPercent(user_ability);
  const barColor = abilityBarColor(user_ability);
  const diff = difficulty_label ? difficultyConfig[difficulty_label] : null;

  return (
    <div
      className={cn("flex items-center gap-5 font-normal text-base", className)}
    >
      {/* Streak */}
      <div
        title={`Current streak: ${current_streak}`}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full border transition-colors",
          current_streak >= 3
            ? "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800"
            : "bg-muted text-muted-foreground border-border",
        )}
      >
        <Flame
          className={cn("h-5 w-5", current_streak >= 3 && "text-orange-500")}
        />
        <span className="font-bold tabular-nums">{current_streak}</span>
      </div>

      {/* Difficulty badge */}
      {diff && (
        <div
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full border font-semibold transition-all duration-300",
            diff.classes,
          )}
          title={`This question is ${diff.label} relative to your current level`}
        >
          {diff.icon}
          <span>{diff.label}</span>
        </div>
      )}
    </div>
  );
}
