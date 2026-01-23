"use client";

import * as React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  EllipsisIcon,
  Eye,
  File,
  Layers,
  MessagesSquare,
  Pencil,
  Star,
  Trash,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface QuestionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  question: Question;
  onPreview: () => void;
  onEdit: () => void;
  onViewComments: () => void;
  onDelete: () => void;
}

function QuestionItem({
  question,
  onPreview,
  onEdit,
  onViewComments,
  onDelete,
  className,
  ...props
}: QuestionItemProps) {
  return (
    <Card className="flex flex-row w-full items-center">
      <div className="flex-1 min-w-0">
        <CardHeader className="whitespace-nowrap truncate block">
          {question.content}
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
              Difficulty {question.difficulty}
            </Badge>

            {question.is_flagged && (
              <Badge variant="destructive">Flagged</Badge>
            )}

            {!question.is_verified && (
              <Badge variant="secondary" className="">
                Unverified
              </Badge>
            )}

            <span className="text-xs font-semibold text-muted-foreground truncate max-w-3xl mr-1">
              <Layers className="inline-block mr-1 h-4 w-4 text-muted-foreground" />
              {question.unit}Hazards and Plates
              <span className="text-slate-300 mx-1.5">•</span>
              <File className="inline-block mr-1 h-4 w-4 text-muted-foreground" />
              {question.subtopic}Tectonic Plates
            </span>
          </div>
        </CardContent>
      </div>

      <div className="px-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="opacity-50 hover:opacity-100 transition-opacity">
            <EllipsisIcon className="h-5 w-5 text-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={onEdit}>
              <Pencil className="h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onViewComments}>
              <MessagesSquare className="h-4 w-4" />
              View Comments
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onPreview}>
              <Eye className="h-4 w-4" /> Preview
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={onDelete}>
              <Trash className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}

export { QuestionItem };
