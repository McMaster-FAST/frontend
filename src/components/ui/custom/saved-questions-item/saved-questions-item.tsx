import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SafeHtmlInline } from "@/components/ui/custom/safe-html";
import { setSavedForLater } from "@/lib/api";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";

interface SavedQuestionItemProps {
  question: SavedForLaterQuestion;
  onRemove: () => void;
  props?: React.ComponentPropsWithoutRef<"div">;
}

export default function SavedQuestionItem({
  question,
  onRemove,
  ...props
}: SavedQuestionItemProps) {
  const authFetch = useAuthFetch();
  return (
    <Card
      className="flex flex-row w-full items-center justify-between"
      {...props}
    >
      <div className="flex-grow min-w-0">
        <CardHeader className="whitespace-nowrap truncate">
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
      <Button variant="primary">
        <Link href={`./question/${question.public_id}`}>Review</Link>
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          setSavedForLater(
            question.course_code,
            question.public_id,
            false,
            authFetch,
          ).then(() => onRemove())
        }
      >
        Remove
      </Button>
    </Card>
  );
}
