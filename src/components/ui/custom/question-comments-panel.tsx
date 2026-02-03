"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Reply, CornerDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/** Mock comment for frontend-only display. Replace with API type when backend is ready. */
export interface CommentItem {
  id: string;
  authorName: string;
  timestamp: string;
  text: string;
  isReply?: boolean;
  replyToAuthor?: string;
}

interface QuestionCommentsPanelProps {
  open: boolean;
  onClose: () => void;
  questionId: string;
  /** Optional: pass question snippet for context in header. Frontend-only for now. */
  questionSnippet?: string;
  /** Mock comments for UI. Replace with API fetch when backend is ready. */
  comments?: CommentItem[];
}

const MOCK_COMMENTS: CommentItem[] = [
  {
    id: "1",
    authorName: "Peter Wardell",
    timestamp: "10d ago",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    isReply: false,
  },
  {
    id: "2",
    authorName: "Jack Fountain",
    timestamp: "1:00 pm",
    text: "Could we clarify the wording for option B?",
    isReply: false,
  },
  {
    id: "3",
    authorName: "Peter Wardell",
    timestamp: "1:05 pm",
    text: "Yes that makes sense",
    isReply: true,
    replyToAuthor: "Jack Fountain",
  },
];

const MAX_PREVIEW_LENGTH = 80;

function CommentBlock({ comment }: { comment: CommentItem }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = comment.text.length > MAX_PREVIEW_LENGTH;
  const displayText = isLong && !expanded
    ? comment.text.slice(0, MAX_PREVIEW_LENGTH).trim() + "..."
    : comment.text;

  return (
    <div
      className={cn(
        "rounded-lg bg-muted/60 p-3 flex flex-col gap-1",
        comment.isReply && "ml-6 border-l-2 border-primary/30 relative"
      )}
    >
      {comment.isReply && (
        <div className="absolute -left-6 top-3 text-muted-foreground">
          <CornerDownLeft className="h-4 w-4" aria-hidden />
        </div>
      )}
      <div className="flex flex-row items-baseline justify-between gap-2">
        <span className="font-semibold text-sm text-foreground">
          {comment.authorName}
        </span>
        <span className="text-xs text-muted-foreground shrink-0">
          {comment.timestamp}
        </span>
      </div>
      <p className="text-sm text-foreground/90 whitespace-pre-wrap">
        {displayText}
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-primary hover:underline text-left"
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}
      <div className="flex justify-end">
        <button
          type="button"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <Reply className="h-3.5 w-3.5" />
          Reply
        </button>
      </div>
    </div>
  );
}

export function QuestionCommentsPanel({
  open: isOpen,
  onClose,
  questionId,
  questionSnippet,
  comments = MOCK_COMMENTS,
}: QuestionCommentsPanelProps) {
  const [newComment, setNewComment] = useState("");

  const handleSend = () => {
    // Frontend-only: no persistence yet
    setNewComment("");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        aria-hidden
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-background shadow-xl flex flex-col animate-in slide-in-from-right duration-200"
        aria-label="Comments"
      >
        {/* Header */}
        <div className="flex flex-row items-center justify-between shrink-0 px-4 py-3 border-b">
          <h2 className="font-poppins font-bold text-lg text-foreground">
            Comments
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Close comments"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Optional question context */}
        {questionSnippet && (
          <div className="shrink-0 px-4 py-2 border-b bg-muted/30">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {questionSnippet}
            </p>
          </div>
        )}

        {/* Comment list */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="flex flex-col gap-3 p-4">
            {comments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <CommentBlock key={comment.id} comment={comment} />
              ))
            )}
          </div>
        </ScrollArea>

        {/* Add comment */}
        <div className="shrink-0 p-4 border-t bg-background">
          <div className="flex flex-row gap-2">
            <Input
              placeholder="Add a comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="primary"
              onClick={handleSend}
              className="bg-[#7A003C] hover:bg-[#7A003C]/90 text-primary-foreground shrink-0"
            >
              Send
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
