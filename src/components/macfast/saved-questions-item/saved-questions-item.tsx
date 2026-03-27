import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { NotebookPen, RotateCcw, Trash, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SafeHtmlInline } from "@/components/macfast/safe-html";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

interface SavedQuestionItemProps {
  question: SavedForLaterQuestion;
  onRemove: () => Promise<void> | void;
  props?: React.ComponentPropsWithoutRef<"div">;
}

export default function SavedQuestionItem({
  question,
  onRemove,
  ...props
}: SavedQuestionItemProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  return (
    <Card
      className="flex flex-row w-full items-center justify-between"
      {...props}
    >
      <div className="flex-grow min-w-0">
        <CardHeader>
          <SafeHtmlInline html={question.content} />
        </CardHeader>

        <CardContent className="flex flex-col gap-1">
          <div className="flex items-center text-xs font-medium text-muted-foreground truncate max-w-3xl mr-1">
            <NotebookPen className="mr-1 size-4 dark:text-gold text-primary" />
            {question.subtopic_name}
          </div>
        </CardContent>
      </div>
      <Button variant="tertiary">
        <Link
          className="inline-flex items-center gap-2"
          href={`./question/${question.public_id}`}
        >
          <RotateCcw />
          Review
        </Link>
      </Button>
      <Button
        variant="tertiary"
        onClick={async () => {
          setIsRemoving(true);
          await onRemove();
          setIsRemoving(false);
        }}
      >
        {isRemoving ? <Spinner /> : <Trash2 />}
        Remove
      </Button>
    </Card>
  );
}
