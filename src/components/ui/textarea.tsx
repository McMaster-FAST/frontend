import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "./label";
import { AlertTriangle } from "lucide-react";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  label?: string;
  errorMessage?: string;
  error?: boolean;
}

function Textarea({
  className,
  label,
  errorMessage,
  error,
  ...props
}: TextareaProps) {
  return (
    <div className="flex flex-col gap-[8px] font-poppins">
      {label && <Label className="text-md px-1">{label}</Label>}
      <div className="flex items-center gap-2">
        <textarea
          data-slot="textarea"
          className={cn(
            error ? "ring ring-[3px] ring-primary/30" : "focus-visible:ring-input-ring/30",
            "border-input placeholder:text-placeholder font-medium focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          {...props}
        />
        {error && <AlertTriangle className="-translate-x-10 text-primary" />}
      </div>
      {error && errorMessage && (
        <Label className="text-sm px-1 text-destructive">{errorMessage}</Label>
      )}
    </div>
  );
}

export { Textarea };
