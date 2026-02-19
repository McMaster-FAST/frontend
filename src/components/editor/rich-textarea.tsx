"use client";

import { useRef, useCallback, useEffect } from "react";
import DOMPurify from "dompurify";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

export interface RichTextareaProps {
  /** HTML string value */
  value?: string;
  /** Fires with sanitised innerHTML on every edit */
  onChange?: (html: string) => void;
  placeholder?: string;
  label?: string;
  error?: boolean;
  errorMessage?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Drop-in replacement for `<Textarea>` that renders HTML content
 * via a `contentEditable` div. Pairs with `<FormattingToolbar>` — the
 * toolbar auto-activates when this element receives focus.
 */
export function RichTextarea({
  value,
  onChange,
  placeholder,
  label,
  error,
  errorMessage,
  className,
  disabled,
}: RichTextareaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);

  // Sync external value → DOM (only when value changes externally)
  useEffect(() => {
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    const el = ref.current;
    if (!el) return;
    const clean = DOMPurify.sanitize(value ?? "");
    if (el.innerHTML !== clean) {
      el.innerHTML = clean;
    }
  }, [value]);

  const handleInput = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    isInternalChange.current = true;
    onChange?.(DOMPurify.sanitize(el.innerHTML));
  }, [onChange]);

  return (
    <div className="flex flex-col gap-[8px] font-poppins">
      {label && <Label className="text-md px-1">{label}</Label>}
      <div className="flex items-center gap-2">
        <div
          ref={ref}
          data-slot="rich-textarea"
          contentEditable={!disabled}
          suppressContentEditableWarning
          role="textbox"
          aria-multiline
          aria-placeholder={placeholder}
          onInput={handleInput}
          className={cn(
            error
              ? "ring ring-[3px] ring-primary/30"
              : "focus-visible:ring-input-ring/30",
            "border-input placeholder:text-placeholder focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 block min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "empty:before:pointer-events-none empty:before:text-muted-foreground empty:before:content-[attr(aria-placeholder)]",
            className
          )}
        />
        {error && <AlertTriangle className="-translate-x-10 text-primary" />}
      </div>
      {error && errorMessage && (
        <Label className="text-sm px-1 text-destructive">{errorMessage}</Label>
      )}
    </div>
  );
}
