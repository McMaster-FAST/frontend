"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface AbilityScoreBarProps extends React.HTMLAttributes<HTMLDivElement> {
  ability_score?: UserAbility | null;
}

export function AbilityScoreBar({
  className,
  ability_score,
  ...props
}: AbilityScoreBarProps) {
  const isUnattempted =
    ability_score?.mastery_value === undefined ||
    ability_score.mastery_value === null;

  return (
    <div className="flex flex-col gap-1 w-full" {...props}>
      <div
        className={cn(
          "relative h-1.5 w-full overflow-hidden rounded-full",
          isUnattempted
            ? "bg-transparent border border-dashed border-light-gray"
            : "bg-light-gray dark:bg-dark-gray",
          className,
        )}
      >
        {isUnattempted ? (
          <div className="absolute inset-0 opacity-[0.2] bg-[repeating-linear-gradient(45deg,var(--dark-gray),var(--dark-gray)_10px,var(--light-gray)_10px,var(--light-gray)_20px)]" />
        ) : (
          <Progress
            value={ability_score?.mastery_value || 0}
            className="h-full w-full bg-transparent"
            indicatorClassName="bg-gold duration-500 ease-out"
          />
        )}
      </div>

      {ability_score?.mastery_caption && (
        <p className="text-xs text-foreground flex justify-between">
          <span>{ability_score.mastery_caption}</span>
        </p>
      )}
    </div>
  );
}
