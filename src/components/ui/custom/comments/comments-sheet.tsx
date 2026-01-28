import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import CommentCard from "./comment-card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Field, FieldDescription, FieldTitle } from "@/components/ui/field";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const comments: QuestionComment[] = [
  {
    public_id: "1",
    fromUser: "Alice",
    question: "What is the capital of France?",
    commentText: "I think it's Paris.",
    replyTo: null,
    timestamp: new Date(Date.now() - 1000 * 24 * 60 * 60 * 1000),
  },
  {
    public_id: "2",
    fromUser: "Bob",
    question: "What is the capital of France?",
    commentText: "Yes, it's Paris.",
    replyTo: "1",
    timestamp: new Date(Date.now() - 366 * 500 * 24 * 60 * 60 * 1000 + 60000),
  },
  {
    public_id: "3",
    fromUser: "Charlie",
    question: "What is the capital of France?",
    commentText: "I thought it was London.",
    replyTo: "1",
    timestamp: new Date(Date.now() - 364 * 24 * 60 * 60 * 1000 + 120000),
  },
  {
    public_id: "4",
    fromUser: "Dave",
    question: "What is the capital of France?",
    commentText: "No, it's definitely Paris.",
    replyTo: null,
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
  },
  {
    public_id: "5",
    fromUser: "Dave",
    question: "What is the capital of France?",
    commentText: "No, it's definitely Paris.",
    replyTo: null,
    timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
  },
  {
    public_id: "6",
    fromUser: "Dave",
    question: "What is the capital of France?",
    commentText: "No, it's definitely Paris.",
    replyTo: null,
    timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
  },
  {
    public_id: "7",
    fromUser: "Dave",
    question:
      "What is the capital of France? Super long question to test wrapping behavior in the comments sheet UI component.",
    commentText:
      "No, it's definitely Paris. Super long comment to test wrapping behavior in the comments sheet UI component.",
    replyTo: null,
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
  },
  {
    public_id: "8",
    fromUser: "Dave",
    question: "What is the capital of France?",
    commentText:
      "No, it's definitely Paris. Super long comment to test wrapping behavior in the comments sheet UI component.",
    replyTo: null,
    timestamp: new Date(Date.now() - 240000),
  },
];

function generateCommentTree(comments: QuestionComment[]) {
  const commentMap: {
    [key: string]: QuestionComment & { replies: QuestionComment[] };
  } = {};
  // Comments that are not replies
  const roots: (QuestionComment & { replies: QuestionComment[] })[] = [];

  comments.forEach((comment) => {
    commentMap[comment.public_id] = { ...comment, replies: [] };
  });

  /* If a comment is a reply, add it to its parent's replies array,
   * otherwise add it to the roots array
   */
  comments.forEach((comment) => {
    if (comment.replyTo) {
      const parent = commentMap[comment.replyTo];
      if (parent) {
        parent.replies.push(commentMap[comment.public_id]);
      }
    } else {
      roots.push(commentMap[comment.public_id]);
    }
  });

  return roots;
}

interface CommentsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  forQuestionId: string;
}

export default function CommentsSheet({
  open,
  onOpenChange,
  forQuestionId,
}: CommentsSheetProps) {
  // const [comments, setComments] = useState<Comment[]>([]);
  const [replyComment, setReplyComment] = useState<QuestionComment | null>(
    null,
  );
  // TODO: Fetch comments
  const commentTree = generateCommentTree(
    comments.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()),
  );
  const onReply = (commentId: string) => {
    setReplyComment(comments.find((c) => c.public_id === commentId) || null);
  };

  function handleKeyDown(event: KeyboardEvent) {
    //Escape closes sheet
    if (event.key === "Escape") {
      onOpenChange(false);
    }

    // Shift + enter for new line
    if (event.key === "Enter" && event.shiftKey) {
      return;
    }

    // Enter to send comment
    if (event.key === "Enter") {
      event.preventDefault();
    }
  }

  useEffect(() => {
    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  return (
    <div className="h-screen">
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex flex-col gap-0">
          <SheetHeader>
            <SheetTitle className="text-2xl font-semibold">Comments</SheetTitle>
            <SheetDescription>Question: {forQuestionId}</SheetDescription>
          </SheetHeader>
          <ScrollArea className="flex-1 overflow-hidden">
            <div className="flex flex-col gap-4 p-4 pt-0 pr-4">
              {commentTree.map((comment) => (
                <CommentCard
                  key={comment.public_id}
                  comment={comment}
                  replies={comment.replies}
                  onReply={onReply}
                />
              ))}
            </div>
          </ScrollArea>
          <SheetFooter className="flex flex-row flex-0 gap-2 border-t-4 border-gold mt-0">
            <Field>
              <FieldTitle>
                {replyComment && (
                  <div className="animate-in slide-in-from-right duration-300 flex items-center gap-2 w-full">
                    <XIcon
                      className="size-4 text-primary hover:cursor-pointer"
                      onClick={() => setReplyComment(null)}
                    />
                    <CommentCard comment={replyComment} replies={[]} />
                  </div>
                )}
              </FieldTitle>
              <InputGroup>
                <InputGroupTextarea
                  placeholder={
                    replyComment
                      ? `Reply to ${replyComment.fromUser}...`
                      : "Add a comment..."
                  }
                  rows={2}
                />
                <InputGroupAddon align="block-end">
                  <InputGroupButton
                    size="sm"
                    variant="primary"
                    className="ml-auto"
                  >
                    {replyComment ? "Reply" : "Comment"}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription className="text-xs text-muted-foreground">
                Shift + Enter for new line
              </FieldDescription>
            </Field>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
