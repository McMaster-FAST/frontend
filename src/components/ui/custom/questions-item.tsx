"use client";

import * as React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { EllipsisIcon } from "lucide-react";
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
    <Card className="flex flex-row w-full">
      <div className="flex-1 w-full items-center">
        <CardHeader className="whitespace-nowrap truncate block">{question.content}</CardHeader>
        <CardContent className="flex flex-col gap-1">
          <Progress value={question.difficulty} />
          <div className="flex flex-row gap-2">
            <Badge variant="secondary">Rating: {question.difficulty}</Badge>
            {question.is_flagged && <Badge variant="default">Flagged</Badge>}
            {!question.is_verified && <Badge variant="default">Unverified</Badge>}
          </div>
        </CardContent>
      </div>
      <div className="flex flex-1 justify-center items-center">
        <Label>{question.unit + " - " + question.subtopic}</Label>
      </div>
      

      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisIcon className="text-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="left">
          <DropdownMenuItem variant="default" onSelect={onEdit}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="default" onSelect={onViewComments}>View Comments</DropdownMenuItem>
          <DropdownMenuItem variant="default" onSelect={onPreview}>
            Preview
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={onDelete}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CardAction className="flex gap-2 h-full items-center"></CardAction>
    </Card>
  );
}

export { QuestionItem };
