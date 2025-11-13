import * as React from "react"

import { cn } from "@/lib/utils"
import { AlertTriangle } from "lucide-react"
import { Label } from "./label";
import { Button } from "./button";

interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean;
  label?: string;
  errorMessage?: string;
}

function Input({ 
    className, 
    type,
    label,
    errorMessage,
    error,
    ...props 
}: InputProps) {
  return (
    <div className="flex flex-col gap-[8px] font-poppins">
      {label && <Label className="text-md px-1">{label}</Label>}
      <div className="flex items-center gap-2">
      <input
        type={type}
        data-slot="input"
        className={cn(
          error ? "ring ring-[3px] ring-primary/30" : "focus-visible:ring-input-ring/30",
          "file:text-foreground placeholder:text-placeholder font-medium selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-[40px] w-full min-w-0 rounded-md border bg-transparent px-3 py-1 transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "focus-visible:border-ring focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        {...props}
        />
        {error && <AlertTriangle className="-translate-x-10 text-primary" />}
        </div>
        {error && errorMessage && <Label className="text-sm px-1 text-destructive">{errorMessage}</Label>}
      </div>
  )
}

export { Input }
