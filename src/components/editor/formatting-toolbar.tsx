"use client";

import { useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Superscript,
  Subscript,
  ImagePlus,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Pilcrow,
  Palette,
  type LucideIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolbarButton } from "./toolbar-button";
import {
  useFormattingToolbar,
  type FormatCommand,
  type HeadingLevel,
  type ToolbarOption,
  ALL_TOOLBAR_OPTIONS,
} from "./use-formatting-toolbar";
import { cn } from "@/lib/utils";

// ── Format button definitions ────────────────────────────────────────

interface FormatDef {
  command: FormatCommand;
  icon: LucideIcon;
  label: string;
  option: ToolbarOption;
}

const INLINE_BUTTONS: FormatDef[] = [
  { command: "bold", icon: Bold, label: "Bold", option: "bold" },
  { command: "italic", icon: Italic, label: "Italic", option: "italic" },
  { command: "underline", icon: Underline, label: "Underline", option: "underline" },
  { command: "strikeThrough", icon: Strikethrough, label: "Strikethrough", option: "strikethrough" },
  { command: "superscript", icon: Superscript, label: "Superscript", option: "superscript" },
  { command: "subscript", icon: Subscript, label: "Subscript", option: "subscript" },
];

const LIST_BUTTONS: FormatDef[] = [
  { command: "insertUnorderedList", icon: List, label: "Bullet list", option: "unorderedList" },
  { command: "insertOrderedList", icon: ListOrdered, label: "Numbered list", option: "orderedList" },
];

// ── Heading definitions ──────────────────────────────────────────────

const HEADING_OPTIONS: { value: HeadingLevel; icon: LucideIcon; label: string }[] = [
  { value: "p", icon: Pilcrow, label: "Paragraph" },
  { value: "h1", icon: Heading1, label: "Heading 1" },
  { value: "h2", icon: Heading2, label: "Heading 2" },
  { value: "h3", icon: Heading3, label: "Heading 3" },
  { value: "h4", icon: Heading4, label: "Heading 4" },
];

// ── Font size presets ────────────────────────────────────────────────

const FONT_SIZE_OPTIONS = [
  { label: "XS", value: "0.75rem" },
  { label: "S", value: "0.875rem" },
  { label: "M", value: "1rem" },
  { label: "L", value: "1.25rem" },
  { label: "XL", value: "1.5rem" },
  { label: "2XL", value: "2rem" },
  { label: "3XL", value: "2.5rem" },
];

// ── Prevent focus steal helper ───────────────────────────────────────

/** Attach to onMouseDown on toolbar buttons to prevent them from stealing focus from the editor */
const preventFocusSteal = (e: React.MouseEvent) => e.preventDefault();

// ── Component ────────────────────────────────────────────────────────

export interface FormattingToolbarProps {
  /** Which toolbar options to show. Defaults to ALL. */
  options?: ToolbarOption[];
  className?: string;
}

export function FormattingToolbar({
  options = ALL_TOOLBAR_OPTIONS,
  className,
}: FormattingToolbarProps) {
  const {
    toolbarRef,
    isVisible,
    execFormat,
    setFontSize,
    setFontColor,
    setHeading,
    insertImage,
  } = useFormattingToolbar();

  const has = (o: ToolbarOption) => options.includes(o);
  const optSet = new Set(options);

  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imagePopoverOpen, setImagePopoverOpen] = useState(false);
  const [headingPopoverOpen, setHeadingPopoverOpen] = useState(false);
  const [sizePopoverOpen, setSizePopoverOpen] = useState(false);

  const handleInsertImage = () => {
    if (!imageUrl.trim()) return;
    insertImage(imageUrl.trim(), imageAlt.trim() || undefined);
    setImageUrl("");
    setImageAlt("");
    setImagePopoverOpen(false);
  };

  const visibleInline = INLINE_BUTTONS.filter((b) => optSet.has(b.option));
  const visibleLists = LIST_BUTTONS.filter((b) => optSet.has(b.option));
  const hasInline = visibleInline.length > 0;
  const hasFontGroup = has("fontSize") || has("fontColor");
  const hasListGroup = visibleLists.length > 0;
  const hasBlockGroup = has("heading") || hasListGroup;

  return (
    <div
      ref={toolbarRef}
      data-slot="formatting-toolbar"
      onMouseDown={preventFocusSteal}
      className={cn(
        "relative top-0 inset-x-0 z-50 flex flex-wrap items-center gap-1 border-b bg-background px-4 py-1.5 shadow-sm transition-all",
        isVisible
          ? "pointer-events-auto text-primary"
          : "pointer-events-none bg-muted text-foreground",
        className
      )}
    >
      {/* ── Inline formatting ──────────────────────────────── */}
      {hasInline &&
        visibleInline.map(({ command, icon, label }) => (
          <ToolbarButton
            key={command}
            icon={icon}
            label={label}
            pressed={false}
            onPressedChange={() => execFormat(command)}
          />
        ))}

      {/* ── Font size / colour ─────────────────────────────── */}
      {hasFontGroup && (
        <>
          {hasInline && <Separator orientation="vertical" className="mx-1 h-6" />}

          {has("fontSize") && (
            <Popover open={sizePopoverOpen} onOpenChange={setSizePopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label="Font size"
                  className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs font-medium hover:bg-muted"
                >
                  Size
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="flex w-auto gap-1 p-2"
                align="start"
                onMouseDown={preventFocusSteal}
              >
                {FONT_SIZE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { setFontSize(opt.value); setSizePopoverOpen(false); }}
                    className="rounded-md px-2 py-1 text-xs font-medium hover:bg-accent"
                  >
                    {opt.label}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          )}

          {has("fontColor") && (
            <label
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md hover:bg-muted"
              aria-label="Font colour"
              onMouseDown={preventFocusSteal}
            >
              <Palette className="size-4" />
              <input
                type="color"
                className="sr-only"
                defaultValue="#000000"
                onInput={(e) => setFontColor((e.target as HTMLInputElement).value)}
              />
            </label>
          )}
        </>
      )}

      {/* ── Headings / lists ───────────────────────────────── */}
      {hasBlockGroup && (
        <>
          {(hasInline || hasFontGroup) && <Separator orientation="vertical" className="mx-1 h-6" />}

          {has("heading") && (
            <Popover open={headingPopoverOpen} onOpenChange={setHeadingPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label="Heading level"
                  className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs font-medium hover:bg-muted"
                >
                  <Pilcrow className="size-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="flex w-auto flex-col gap-1 p-2"
                align="start"
                onMouseDown={preventFocusSteal}
              >
                {HEADING_OPTIONS.map(({ value, icon: Icon, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => { setHeading(value); setHeadingPopoverOpen(false); }}
                    className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm hover:bg-accent"
                  >
                    <Icon className="size-4" />
                    {label}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          )}

          {visibleLists.map(({ command, icon, label }) => (
            <ToolbarButton
              key={command}
              icon={icon}
              label={label}
              pressed={false}
              onPressedChange={() => execFormat(command)}
            />
          ))}
        </>
      )}

      {/* ── Insert image ───────────────────────────────────── */}
      {has("image") && (
        <>
          {(hasInline || hasFontGroup || hasBlockGroup) && (
            <Separator orientation="vertical" className="mx-1 h-6" />
          )}

          <Popover open={imagePopoverOpen} onOpenChange={setImagePopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="tertiary"
                size="icon-sm"
                aria-label="Insert image"
                className="[&>svg:last-child]:hidden"
              >
                <ImagePlus className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 space-y-3" align="start">
              <p className="text-sm font-medium">Insert Image</p>
              <Input
                placeholder="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <Input
                placeholder="Alt text (optional)"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
              />
              <Button
                size="sm"
                className="w-full"
                onClick={handleInsertImage}
                disabled={!imageUrl.trim()}
              >
                Insert
              </Button>
            </PopoverContent>
          </Popover>
        </>
      )}
    </div>
  );
}

export { ALL_TOOLBAR_OPTIONS } from "./use-formatting-toolbar";
export type { ToolbarOption, FormatCommand, HeadingLevel } from "./use-formatting-toolbar";
export { useFormattingToolbar } from "./use-formatting-toolbar";
export { ToolbarButton } from "./toolbar-button";
