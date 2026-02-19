import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { NotebookPen, SquareArrowOutUpRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SafeHtmlInline } from "@/components/ui/custom/safe-html";

interface SavedQuestionItemProps {
  question: SavedForLaterQuestion;
  props?: React.ComponentPropsWithoutRef<"div">;
}

export default function SavedQuestionItem({
  question,
  ...props
}: SavedQuestionItemProps) {
  return (
    <Card className="flex flex-row w-full items-center justify-between" {...props}>
      <div className="flex-grow min-w-0">
        <CardHeader className="whitespace-nowrap truncate overflow-ellipsis block">
          <div className="flex flex-row">
            <SafeHtmlInline html={question.content} />
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-1">
          <div className="flex items-center text-xs font-medium text-dark-gray truncate max-w-3xl mr-1">
            <NotebookPen className="mr-1 size-4 text-primary" />
            {question.subtopic_name}
          </div>
        </CardContent>
      </div>
      <CardAction className="flex flex-row gap-2 items-center">
        <Button variant="primary">
          <Link href={`./question/${question.public_id}`}>Review</Link>
        </Button>
        <Button variant="secondary" size="sm">
          <Trash2 className="size-4" />
        </Button>
      </CardAction>
    </Card>
  );
}
