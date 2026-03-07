import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { CircleDashed, NotebookPen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Skeleton } from "@/components/ui/skeleton";

interface SavedQuestionsSkeletonProps {
  props?: React.ComponentPropsWithoutRef<"div">;
}

export default function SavedQuestionsSkeleton({
  ...props
}: SavedQuestionsSkeletonProps) {
  return (
    <Card
      className="flex flex-row w-full items-center justify-between"
      {...props}
    >
      <div className="flex-grow min-w-0">
        <CardHeader>
          <div className="flex flex-row">
            <Skeleton className="h-4 w-full" />
          </div>
        </CardHeader>

        <CardContent>
            <Skeleton className="h-4 w-32" />
        </CardContent>
      </div>
      <CardAction className="flex flex-row gap-2 items-center">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
      </CardAction>
    </Card>
  );
}
