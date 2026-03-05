"use client";

import { JSX, useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import DOMPurify from "dompurify";
import {
  $applyNodeReplacement,
  $insertNodes,
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  DecoratorNode,
  type NodeKey,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  type LexicalNode,
  SELECTION_CHANGE_COMMAND,
  type EditorState,
  type LexicalEditor,
  type SerializedLexicalNode,
  type TextFormatType,
} from "lexical";
import {
  $createHeadingNode,
  $isHeadingNode,
  HeadingNode,
  type HeadingTagType,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import {
  ListItemNode,
  ListNode,
  $insertList,
  $isListNode,
  $removeList,
  type ListType,
} from "@lexical/list";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import { ToolbarButton } from "./toolbar-button";
import {
  Bold,
  Italic,
  List as ListIcon,
  ListOrdered,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
  ImagePlus,
} from "lucide-react";

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

const lexicalTheme = {
  paragraph: "my-0",
  heading: {
    h1: "text-2xl font-semibold",
    h2: "text-xl font-semibold",
    h3: "text-lg font-semibold",
    h4: "text-base font-semibold",
    h5: "text-sm font-semibold",
    h6: "text-sm font-semibold",
  },
  list: {
    ul: "ml-6 list-disc",
    ol: "ml-6 list-decimal",
    listitem: "my-0.5",
  },
  text: {
    bold: "font-semibold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    subscript: "align-sub text-xs",
    superscript: "align-super text-xs",
  },
};

interface SerializedImageNode extends SerializedLexicalNode {
  src: string;
  altText: string;
  type: "image";
  version: 1;
}

class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__altText, node.__key);
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    return new ImageNode(serializedNode.src, serializedNode.altText);
  }

  constructor(src: string, altText: string, key?: NodeKey) {
    super(key);
    this.__src = src;
    this.__altText = altText;
  }

  createDOM(): HTMLElement {
    return document.createElement("span");
  }

  updateDOM(): false {
    return false;
  }

  exportJSON(): SerializedImageNode {
    return {
      ...super.exportJSON(),
      type: "image",
      version: 1,
      src: this.__src,
      altText: this.__altText,
    };
  }

  decorate(): JSX.Element {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={this.__src}
        alt={this.__altText}
        className="my-2 h-auto max-w-full rounded-md"
      />
    );
  }
}

function $createImageNode(src: string, altText: string) {
  return $applyNodeReplacement(new ImageNode(src, altText));
}

function toPlainText(value: string) {
  if (!value) return "";
  if (!value.includes("<")) return value;
  const doc = new DOMParser().parseFromString(value, "text/html");
  return doc.body.textContent ?? "";
}

function SyncValuePlugin({
  value,
  ignoreNextExternalSyncRef,
}: {
  value?: string;
  ignoreNextExternalSyncRef: { current: boolean };
}) {
  const [editor] = useLexicalComposerContext();
  const lastAppliedValueRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (value === undefined) return;

    if (ignoreNextExternalSyncRef.current) {
      ignoreNextExternalSyncRef.current = false;
      return;
    }

    if (value === lastAppliedValueRef.current) return;

    editor.update(() => {
      const root = $getRoot();
      root.clear();
      const lines = toPlainText(value).split(/\r?\n/);
      lines.forEach((line) => {
        const paragraph = $createParagraphNode();
        if (line.length > 0) {
          paragraph.append($createTextNode(line));
        }
        root.append(paragraph);
      });
      if (root.getChildrenSize() === 0) {
        root.append($createParagraphNode());
      }
    });

    lastAppliedValueRef.current = value;
  }, [editor, value, ignoreNextExternalSyncRef]);

  return null;
}

interface ToolbarPluginProps {
  className?: string;
  isFocused?: boolean;
}
function ToolbarPlugin({ className, isFocused }: ToolbarPluginProps) {
  const [editor] = useLexicalComposerContext();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [activeHeading, setActiveHeading] = useState<"p" | HeadingTagType>("p");
  const [activeListType, setActiveListType] = useState<ListType | null>(null);

  const findParent = (
    node: LexicalNode,
    predicate: (value: LexicalNode) => boolean,
  ): LexicalNode | null => {
    let current: LexicalNode | null = node;
    while (current) {
      if (predicate(current)) return current;
      current = current.getParent();
    }
    return null;
  };

  const updateToolbarState = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        setIsBold(false);
        setIsItalic(false);
        setIsUnderline(false);
        setIsStrikethrough(false);
        setIsSuperscript(false);
        setIsSubscript(false);
        setActiveHeading("p");
        setActiveListType(null);
        return;
      }
      const anchorNode = selection.anchor.getNode();
      const topLevel = anchorNode.getTopLevelElementOrThrow();
      const nearestHeading = $isHeadingNode(topLevel) ? topLevel : null;
      const nearestList = findParent(anchorNode, $isListNode);
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsSuperscript(selection.hasFormat("superscript"));
      setIsSubscript(selection.hasFormat("subscript"));
      setActiveHeading(nearestHeading ? nearestHeading.getTag() : "p");
      setActiveListType(
        nearestList && $isListNode(nearestList)
          ? nearestList.getListType()
          : null,
      );
    });
  }, [editor]);

  useEffect(() => {
    const unregisterUpdate = editor.registerUpdateListener(() => {
      updateToolbarState();
    });
    const unregisterSelection = editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbarState();
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );

    return () => {
      unregisterUpdate();
      unregisterSelection();
    };
  }, [editor, updateToolbarState]);

  const applyFormat = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const applyHeading = (heading: "p" | HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      if (heading === "p") {
        $setBlocksType(selection, () => $createParagraphNode());
        return;
      }
      $setBlocksType(selection, () => $createHeadingNode(heading));
    });
  };

  const toggleList = (listType: ListType) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      const listNode = findParent(selection.anchor.getNode(), $isListNode);
      if (
        listNode &&
        $isListNode(listNode) &&
        listNode.getListType() === listType
      ) {
        $removeList();
        return;
      }
      $insertList(listType);
    });
  };

  const insertImage = (dataUrl: string, altText: string) => {
    editor.update(() => {
      const imageNode = $createImageNode(dataUrl, altText);
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $insertNodes([imageNode, $createParagraphNode()]);
        return;
      }
      const root = $getRoot();
      root.append(imageNode);
      root.append($createParagraphNode());
    });
  };

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      insertImage(reader.result, file.name);
      input.value = "";
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1 border-b bg-muted/30 overflow-hidden transition-all duration-200 ease-in-out",
        isFocused
          ? "max-h-20 px-2 py-1 opacity-100"
          : "max-h-0 px-0 py-0 opacity-0",
        className,
      )}
      onMouseDown={(e) => e.preventDefault()}
    >
      <ToolbarButton
        icon={Bold}
        label="Bold"
        pressed={isBold}
        onPressedChange={() => applyFormat("bold")}
      />
      <ToolbarButton
        icon={Italic}
        label="Italic"
        pressed={isItalic}
        onPressedChange={() => applyFormat("italic")}
      />
      <ToolbarButton
        icon={Underline}
        label="Underline"
        pressed={isUnderline}
        onPressedChange={() => applyFormat("underline")}
      />
      <ToolbarButton
        icon={Strikethrough}
        label="Strikethrough"
        pressed={isStrikethrough}
        onPressedChange={() => applyFormat("strikethrough")}
      />
      <ToolbarButton
        icon={Superscript}
        label="Superscript"
        pressed={isSuperscript}
        onPressedChange={() => applyFormat("superscript")}
      />
      <ToolbarButton
        icon={Subscript}
        label="Subscript"
        pressed={isSubscript}
        onPressedChange={() => applyFormat("subscript")}
      />
      <select
        aria-label="Heading level"
        value={activeHeading}
        onChange={(e) => applyHeading(e.target.value as "p" | HeadingTagType)}
        className="h-8 rounded-md border border-input bg-background px-2 text-sm relative z-50"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <option value="p">Paragraph</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="h4">Heading 4</option>
        <option value="h5">Heading 5</option>
        <option value="h6">Heading 6</option>
      </select>
      <ToolbarButton
        icon={ListOrdered}
        label="Numbered list"
        pressed={activeListType === "number"}
        onPressedChange={() => toggleList("number")}
      />
      <ToolbarButton
        icon={ListIcon}
        label="Bulleted list"
        pressed={activeListType === "bullet"}
        onPressedChange={() => toggleList("bullet")}
      />
      <ToolbarButton
        icon={ImagePlus}
        label="Insert image"
        pressed={false}
        onPressedChange={() => imageInputRef.current?.click()}
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageFileChange}
      />
    </div>
  );
}

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
  const ignoreNextExternalSyncRef = useRef(false);
  const [isFocused, setIsFocused] = useState(false);
  const initialConfig = {
    namespace: "macfast-rich-textarea",
    theme: lexicalTheme,
    nodes: [HeadingNode, ListNode, ListItemNode, ImageNode],
    onError(error: Error) {
      throw error;
    },
  };

  const handleChange = useCallback(
    (_editorState: EditorState, editor: LexicalEditor) => {
      ignoreNextExternalSyncRef.current = true;
      const html = editor.getRootElement()?.innerHTML ?? "";
      onChange?.(DOMPurify.sanitize(html));
    },
    [onChange],
  );

  return (
    <div
      className="flex flex-col gap-[8px] font-poppins m-1"
      onFocus={() => {
        setIsFocused(true);
      }}
      onBlur={() => {
        setIsFocused(false);
      }}
    >
      {label && <Label className="text-md px-1">{label}</Label>}
      <div className="flex items-center gap-2">
        <div
          className={cn(
            error
              ? "ring ring-[3px] ring-primary/30"
              : "focus-within:ring-ring/50",
            "border-input dark:bg-input/30 relative w-full overflow-hidden rounded-md border bg-transparent text-base shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] md:text-sm",
            disabled && "cursor-not-allowed opacity-50",
            className,
          )}
        >
          <LexicalComposer initialConfig={initialConfig}>
            <ToolbarPlugin isFocused={isFocused} />

            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  aria-placeholder={placeholder ?? "Enter text..."}
                  placeholder={
                    <span>
                      {/* TODO fix how this is laid out it is stupid */}
                    </span>
                  }
                  className="min-h-16 px-3 py-2 outline-none"
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <ListPlugin />
            <OnChangePlugin onChange={handleChange} />
            <SyncValuePlugin
              value={value}
              ignoreNextExternalSyncRef={ignoreNextExternalSyncRef}
            />
          </LexicalComposer>
        </div>
        {error && <AlertTriangle className="-translate-x-10 text-primary" />}
      </div>
      {error && errorMessage && (
        <Label className="text-sm px-1 text-destructive">{errorMessage}</Label>
      )}
    </div>
  );
}
