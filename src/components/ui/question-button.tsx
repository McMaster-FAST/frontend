"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

interface QuestionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "practice" | "sections" | "preview" | "edit" | "upload";
  expanded?: boolean;
}

function QuestionButton({
  variant,
  onClick,
  children,
  expanded,
  className,
  ...props
}: QuestionButtonProps) {
  const baseClasses = "font-medium transition-all duration-200";

  const variants = {
    practice:
      "px-6 py-2 bg-white text-maroon border-2 border-maroon rounded-full hover:bg-maroon hover:text-white",
    sections: `px-6 py-2 rounded-md text-white flex items-center gap-2 ${
      expanded ? "bg-maroon hover:bg-maroon/90" : "bg-gold hover:bg-gold/90"
    }`,
    preview:
      "px-6 py-2 bg-white text-maroon border-2 border-maroon rounded-full hover:bg-off-white",
    edit: "px-6 py-2 bg-maroon text-white rounded-full hover:bg-maroon/90",
    upload:
      "px-6 py-2 bg-white text-maroon border-2 border-maroon rounded-full hover:bg-maroon hover:text-white",
  };

  return (
    <button
      className={cn(baseClasses, variants[variant], className)}
      onClick={onClick}
      {...props}
    >
      {children}
      {variant === "sections" && (
        <svg
          className={`w-4 h-4 transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      )}
    </button>
  );
}

export { QuestionButton };
