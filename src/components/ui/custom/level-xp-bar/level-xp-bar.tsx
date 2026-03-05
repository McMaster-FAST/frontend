"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

interface AnimatedXPBarProps {
  totalXp: number;
}

export function AnimatedXPBar({ totalXp }: AnimatedXPBarProps) {
  const [progress, setProgress] = useState(0);

  // Not really sure how to handle
  // ie. should it all be sent by the backend pre-calculated? Or should the frontend calculate the level and current XP based on total XP?
  const level = 3;
  const currentXp = totalXp % 100;
  const maxXp = 100;

  useEffect(() => {
    const timer = setTimeout(() => {
      const safeMax = maxXp > 0 ? maxXp : 100;
      const percentage = Math.min((currentXp / safeMax) * 100, 100);
      setProgress(percentage);
    }, 150);
    return () => clearTimeout(timer);
  }, [currentXp, maxXp]);

  return (
    <div className="flex flex-row items-center gap-3 w-full mt-0">
      <div className="flex items-center justify-center shrink-0 min-w-[24px] h-6 px-2 rounded-full border-2 border-gold bg-off-white text-maroon text-xs font-bold shadow-sm leading-none">
        {level}
      </div>

      <div className="flex-1">
        <Progress
          value={progress}
          className="h-1.5 bg-light-gray"
          indicatorClassName="bg-gradient-to-r from-maroon via-orange-500 to-gold duration-1000 ease-out"
        />
      </div>

      <div className="shrink-0 text-xs text-dark-gray font-medium tracking-wide">
        {currentXp} / {maxXp} XP
      </div>
    </div>
  );
}
