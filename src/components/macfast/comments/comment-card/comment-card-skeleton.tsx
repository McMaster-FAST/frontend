import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function CommentCardSkeleton() {
  return (
    <div className="flex flex-row w-full gap-2">
      <Card className="w-full px-4">
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="inline-flex items-center gap-2">
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-4 w-full mt-3" />
          <Skeleton className="h-4 w-2/3 mt-2" />
        </CardContent>
      </Card>
    </div>
  );
}
