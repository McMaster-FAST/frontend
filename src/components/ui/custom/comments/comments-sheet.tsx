import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import CommentCard from "@/components/ui/custom/comments/comment-card/comment-card";
import CommentCardSkeleton from "@/components/ui/custom/comments/comment-card/comment-card-skeleton";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Field, FieldDescription, FieldTitle } from "@/components/ui/field";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { XIcon } from "lucide-react";
import { useQuestionComments } from "@/hooks/useQuestionComments";

interface CommentsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questionId: string | null; // Added prop
}

export default function CommentsSheet({
  open,
  onOpenChange,
  questionId,
}: CommentsSheetProps) {
  const { comments, isLoading, addComment, replyToComment } =
    useQuestionComments(questionId);
  const [replyComment, setReplyComment] = useState<QuestionComment | null>(
    null,
  );
  const [newCommentText, setNewCommentText] = useState("");

  const handleSend = async () => {
    if (!newCommentText.trim()) return;

    if (replyComment) {
      await replyToComment(replyComment.public_id, newCommentText);
    } else {
      await addComment(newCommentText);
    }

    setNewCommentText("");
    setReplyComment(null);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-0">
        <SheetHeader>
          <SheetTitle className="text-2xl font-semibold">Comments</SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <ScrollArea className="flex-1 overflow-hidden border-t-2">
            <div className="flex flex-col gap-4 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <CommentCardSkeleton key={i} />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <ScrollArea className="flex-1 overflow-hidden border-t-2">
            <div className="flex flex-col gap-4 p-4 pr-4">
              {comments.map((comment) => (
                <CommentCard
                  key={comment.public_id}
                  comment={comment}
                  replies={comment.replies} // Backend already nested these!
                  onReply={() => setReplyComment(comment)}
                />
              ))}
            </div>
          </ScrollArea>
        )}
        {!isLoading && (!comments || comments.length === 0) && (
          <p className="p-4 h-full text-muted-foreground text-lg">
            There are no comments on this question. <br />
            Be the first!
          </p>
        )}
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
            <InputGroup className="bg-background items-start">
              <InputGroupTextarea
                placeholder={
                  replyComment
                    ? `Reply to ${replyComment.user_name}...`
                    : "Add a comment..."
                }
                rows={2}
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
              />
              <InputGroupAddon align="block-end">
                <InputGroupButton
                  size="sm"
                  variant="primary"
                  className="ml-auto"
                  disabled={newCommentText.trim() === ""}
                  onClick={handleSend}
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
  );
}
