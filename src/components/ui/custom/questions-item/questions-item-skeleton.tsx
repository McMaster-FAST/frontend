"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EllipsisIcon, Loader2, NotebookPen, Star, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "../../skeleton";

function QuestionItemSkeleton() {
  return (
    <Card className="flex flex-row w-full items-center">
      <div className="flex-1 min-w-0">
        <CardHeader className="whitespace-nowrap truncate block">
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>

        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-row items-center gap-2">
            <Badge
              variant="secondary"
              className="text-dark-gray whitespace-nowrap"
            >
              <Star
                fill="currentColor"
                className="inline-block mr-1 h-3 w-3 text-primary-hover"
              />
              Difficulty <Skeleton className="inline-block h-5 w-16" />
            </Badge>

            <div className="flex items-center text-xs font-medium text-dark-gray truncate max-w-3xl mr-1">
              <NotebookPen className="mr-1 h-4 w-4 text-primary" />
              <Skeleton className="h-5 w-40" />
            </div>
          </div>
        </CardContent>
      </div>

      <div className="px-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="opacity-50 hover:opacity-100 transition-opacity">
            <EllipsisIcon className="h-5 w-5 text-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex items-center justify-center p-2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}

export { QuestionItemSkeleton };
