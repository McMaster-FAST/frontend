"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";

// ── Types ────────────────────────────────────────────────────────────

export type FormatCommand =
  | "bold"
  | "italic"
  | "underline"
  | "strikeThrough"
  | "superscript"
  | "subscript"
  | "insertOrderedList"
  | "insertUnorderedList";

export type HeadingLevel = "p" | "h1" | "h2" | "h3" | "h4";

export type ToolbarOption =
  | "bold"
  | "italic"
  | "underline"
  | "strikethrough"
  | "superscript"
  | "subscript"
  | "fontSize"
  | "fontColor"
  | "heading"
  | "orderedList"
  | "unorderedList"
  | "image";

export const ALL_TOOLBAR_OPTIONS: ToolbarOption[] = [
  "bold",
  "italic",
  "underline",
  "strikethrough",
  "superscript",
  "subscript",
  "fontSize",
  "fontColor",
  "heading",
  "orderedList",
  "unorderedList",
  "image",
];

const RICH_TEXTAREA_SELECTOR = "[data-slot='rich-textarea']";

// ── Inline tag mapping ───────────────────────────────────────────────

const FORMAT_TAG: Record<string, string> = {
  bold: "b",
  italic: "i",
  underline: "u",
  strikeThrough: "s",
  superscript: "sup",
  subscript: "sub",
};

// ── Selection / Range helpers ────────────────────────────────────────

function getEditorRange(editor: HTMLElement): Range | null {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;
  const range = sel.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer)) return null;
  return range;
}

/** Walk up from `node` looking for an element matching `tagName`, stopping at `boundary`. */
function closestTag(
  node: Node,
  tagName: string,
  boundary: HTMLElement
): HTMLElement | null {
  let cur: Node | null = node;
  const upper = tagName.toUpperCase();
  while (cur && cur !== boundary) {
    if (cur instanceof HTMLElement && cur.tagName === upper) return cur;
    cur = cur.parentNode;
  }
  return null;
}

/** Replace an element with its children in-place. */
function unwrapElement(el: HTMLElement): void {
  const parent = el.parentNode;
  if (!parent) return;
  while (el.firstChild) parent.insertBefore(el.firstChild, el);
  parent.removeChild(el);
}

/**
 * Toggle an inline tag around the current selection.
 * If the selection is already entirely inside the tag → unwrap it.
 * Otherwise wrap the selection in a new element of that tag.
 */
function toggleInlineTag(editor: HTMLElement, tagName: string, style?: string): void {
  const sel = window.getSelection();
  const range = getEditorRange(editor);
  if (!sel || !range || range.collapsed) return;

  // If already wrapped, unwrap
  const existing = closestTag(range.commonAncestorContainer, tagName, editor);
  if (existing && !style) {
    // Save selection offsets relative to the parent before unwrapping
    unwrapElement(existing);
    return;
  }

  // Extract → wrap in inline element → re-insert
  const fragment = range.extractContents();
  const wrapper = document.createElement(tagName);
  if (style) wrapper.setAttribute("style", style);
  wrapper.appendChild(fragment);

  // Flatten any nested identical tags (e.g. <b><b>x</b></b> → <b>x</b>)
  wrapper
    .querySelectorAll(tagName)
    .forEach((nested) => unwrapElement(nested as HTMLElement));

  range.insertNode(wrapper);

  // Restore selection around the wrapper contents
  sel.removeAllRanges();
  const restored = document.createRange();
  restored.selectNodeContents(wrapper);
  sel.addRange(restored);
}

/** Wrap the selection in a `<span>` with the given inline style. */
function wrapInlineStyle(editor: HTMLElement, style: string): void {
  const sel = window.getSelection();
  const range = getEditorRange(editor);
  if (!sel || !range || range.collapsed) return;

  const fragment = range.extractContents();
  const span = document.createElement("span");
  span.setAttribute("style", style);
  span.appendChild(fragment);
  range.insertNode(span);

  sel.removeAllRanges();
  const restored = document.createRange();
  restored.selectNodeContents(span);
  sel.addRange(restored);
}

/**
 * Find the block-level ancestor that is a direct child of the editor,
 * starting from `node`.
 */
function findDirectBlock(node: Node, editor: HTMLElement): HTMLElement | null {
  let cur: Node | null = node;
  while (cur && cur.parentNode !== editor) cur = cur.parentNode;
  return cur instanceof HTMLElement ? cur : null;
}

function applyHeading(editor: HTMLElement, level: HeadingLevel): void {
  const range = getEditorRange(editor);
  if (!range) return;

  const block = findDirectBlock(range.startContainer, editor);
  if (!block) {
    // Selection is in a bare text node directly inside the editor — wrap it
    const sel = window.getSelection();
    const wrapper = document.createElement(level);
    range.surroundContents(wrapper);
    sel?.removeAllRanges();
    const r = document.createRange();
    r.selectNodeContents(wrapper);
    sel?.addRange(r);
    return;
  }

  // Replace block tag in place
  const replacement = document.createElement(level);
  replacement.innerHTML = block.innerHTML;
  editor.replaceChild(replacement, block);

  const sel = window.getSelection();
  sel?.removeAllRanges();
  const r = document.createRange();
  r.selectNodeContents(replacement);
  sel?.addRange(r);
}

function toggleList(editor: HTMLElement, ordered: boolean): void {
  const sel = window.getSelection();
  const range = getEditorRange(editor);
  if (!sel || !range) return;

  const listTag = ordered ? "ol" : "ul";

  // If already inside a list of the same type, unwrap it
  const existing = closestTag(range.commonAncestorContainer, listTag, editor);
  if (existing) {
    const parent = existing.parentNode;
    if (!parent) return;
    // Replace each <li> with a <p>
    Array.from(existing.children).forEach((li) => {
      const p = document.createElement("p");
      p.innerHTML = li.innerHTML;
      parent.insertBefore(p, existing);
    });
    parent.removeChild(existing);
    return;
  }

  // Wrap selection in a list
  if (range.collapsed) {
    const list = document.createElement(listTag);
    const li = document.createElement("li");
    li.appendChild(document.createElement("br"));
    list.appendChild(li);
    range.insertNode(list);
    const r = document.createRange();
    r.setStart(li, 0);
    r.collapse(true);
    sel.removeAllRanges();
    sel.addRange(r);
    return;
  }

  const fragment = range.extractContents();
  const list = document.createElement(listTag);

  // Each top-level child becomes a <li>
  const nodes = Array.from(fragment.childNodes);
  for (const node of nodes) {
    const li = document.createElement("li");
    li.appendChild(node);
    list.appendChild(li);
  }

  range.insertNode(list);
  sel.removeAllRanges();
  const r = document.createRange();
  r.selectNodeContents(list);
  sel.addRange(r);
}

function insertImageNode(editor: HTMLElement, url: string, alt?: string): void {
  const sel = window.getSelection();
  const range = getEditorRange(editor);
  if (!sel || !range) return;

  const img = document.createElement("img");
  img.src = DOMPurify.sanitize(url);
  img.alt = alt ?? "";
  img.style.maxWidth = "100%";
  img.style.height = "auto";

  range.deleteContents();
  range.insertNode(img);

  const r = document.createRange();
  r.setStartAfter(img);
  r.collapse(true);
  sel.removeAllRanges();
  sel.addRange(r);
}

// ── Hook ─────────────────────────────────────────────────────────────

export function useFormattingToolbar() {
  const activeElRef = useRef<HTMLElement | null>(null);
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (blurTimeout.current) {
        clearTimeout(blurTimeout.current);
        blurTimeout.current = null;
      }
      if (target.closest("[data-slot='formatting-toolbar']")) return;
      if (target.matches(RICH_TEXTAREA_SELECTOR)) {
        activeElRef.current = target;
        setIsVisible(true);
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      const related = e.relatedTarget as HTMLElement | null;
      if (
        related?.closest("[data-slot='formatting-toolbar']") ||
        related?.closest("[data-radix-popper-content-wrapper]")
      ) {
        return;
      }
      blurTimeout.current = setTimeout(() => {
        const active = document.activeElement as HTMLElement | null;
        if (
          active?.closest("[data-slot='formatting-toolbar']") ||
          active?.matches(RICH_TEXTAREA_SELECTOR)
        ) {
          return;
        }
        setIsVisible(false);
        activeElRef.current = null;
      }, 150);
    };

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);
    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
      if (blurTimeout.current) clearTimeout(blurTimeout.current);
    };
  }, []);

  const notifyChange = useCallback(() => {
    activeElRef.current?.dispatchEvent(new Event("input", { bubbles: true }));
  }, []);

  const execFormat = useCallback(
    (command: FormatCommand) => {
      const el = activeElRef.current;
      if (!el) return;

      const tag = FORMAT_TAG[command];
      if (tag) {
        toggleInlineTag(el, tag);
      } else if (command === "insertOrderedList") {
        toggleList(el, true);
      } else if (command === "insertUnorderedList") {
        toggleList(el, false);
      }
      notifyChange();
    },
    [notifyChange]
  );

  const setFontSize = useCallback(
    (size: string) => {
      const el = activeElRef.current;
      if (!el) return;
      wrapInlineStyle(el, `font-size:${size}`);
      notifyChange();
    },
    [notifyChange]
  );

  const setFontColor = useCallback(
    (color: string) => {
      const el = activeElRef.current;
      if (!el) return;
      wrapInlineStyle(el, `color:${color}`);
      notifyChange();
    },
    [notifyChange]
  );

  const setHeading = useCallback(
    (level: HeadingLevel) => {
      const el = activeElRef.current;
      if (!el) return;
      applyHeading(el, level);
      notifyChange();
    },
    [notifyChange]
  );

  const insertImage = useCallback(
    (url: string, alt?: string) => {
      const el = activeElRef.current;
      if (!el) return;
      insertImageNode(el, url, alt);
      notifyChange();
    },
    [notifyChange]
  );

  return {
    toolbarRef,
    isVisible,
    activeElRef,
    execFormat,
    setFontSize,
    setFontColor,
    setHeading,
    insertImage,
  };
}
