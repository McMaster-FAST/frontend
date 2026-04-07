import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

interface MultiProgressProps extends React.ComponentProps<
  typeof ProgressPrimitive.Root
> {
  indicators: number[];
  colours?: string[];
  colourClasses?: string[];
}

function MultiProgress({
  className,
  indicators,
  colours,
  colourClasses,
  ...props
}: MultiProgressProps) {
  let accumulatedValue = 0;
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-muted h-1 rounded-full relative flex w-full items-center overflow-x-hidden",
        className,
      )}
      {...props}
    >
      {indicators.map((indicatorValue, index) => {
        // accumulatedValue += indicatorValue || 0;
        return (
          <ProgressPrimitive.Indicator
            key={index}
            data-slot="progress-indicator"
            className={`size-full transition-all bg-${colourClasses?.[index % colourClasses.length]}`}
            style={{
              background: colours?.[index % colours.length],
              width: `${indicatorValue}%`,
            }}
          />
        );
      })}
    </ProgressPrimitive.Root>
  );
}

export { MultiProgress };
