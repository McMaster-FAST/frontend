import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { getTimeString } from "./time-utils";
import { ChevronUp, CornerDownRight } from "lucide-react";
import { useState } from "react";

interface CommentCardProps {
  comment: QuestionComment;
  replies?: QuestionComment[];
  onReply?: (commentId: string) => void;
}
export default function CommentCard({
  comment,
  replies,
  onReply,
}: CommentCardProps) {
  const [areRepliesOpen, setAreRepliesOpen] = useState(false);
  const [isSeeMore, setIsSeeMore] = useState(false);
  const CUTOFF_LENGTH = 50;
  const truncatedCommentText =
    comment.commentText.length > CUTOFF_LENGTH && !isSeeMore
      ? comment.commentText.slice(0, CUTOFF_LENGTH) + "..."
      : comment.commentText;

  return (
    <div className="flex flex-row w-full gap-2">
      {!replies && <CornerDownRight className="text-primary ml-auto" />}
      <div className="flex flex-col gap-2 w-full">
        <Card className="w-full">
          <CardContent>
            <CardTitle className="flex justify-between items-center text-foreground">
              {comment.fromUser}
              <p className="text-sm text-muted-foreground">
                {getTimeString(comment.timestamp)}
              </p>
            </CardTitle>
            <CardDescription
              className={`transition-all duration-300 ease-in-out ${isSeeMore ? "" : "overflow-hidden"}`}
            >
              {truncatedCommentText}
            </CardDescription>
            <CardFooter className="text-sm gap-2 flex flex-row">
              {comment.commentText.length > CUTOFF_LENGTH && (
                <p
                  onClick={() => setIsSeeMore(!isSeeMore)}
                  className="cursor-pointer text-foreground hover:underline select-none"
                >
                  {isSeeMore ? "See less" : "See more"}
                </p>
              )}
              {onReply && (
                <p
                  onClick={() => onReply(comment.public_id)}
                  className="text-primary ml-auto cursor-pointer hover:underline select-none"
                >
                  Reply
                </p>
              )}
            </CardFooter>
          </CardContent>
        </Card>
        {replies && (
          <>
            {replies.length > 0 && (
              <Label
                className="text-sm flex items-center gap-1 cursor-pointer select-none ml-auto"
                onClick={() => setAreRepliesOpen(!areRepliesOpen)}
              >
                {areRepliesOpen ? "Hide" : "View"} {replies.length}{" "}
                {replies.length === 1 ? "reply" : "replies"}
                <ChevronUp
                  className="h-4 w-4 transition-transform duration-200 ease-in-out"
                  style={{
                    transform: areRepliesOpen
                      ? "rotate(0deg)"
                      : "rotate(180deg)",
                  }}
                />
              </Label>
            )}
            {replies.length > 0 && areRepliesOpen && (
              <div className="flex flex-col gap-2 mt-2 ml-4">
                {replies.map((reply) => (
                  <CommentCard key={reply.public_id} comment={reply} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
