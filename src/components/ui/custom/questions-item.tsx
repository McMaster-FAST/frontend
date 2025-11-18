"use client";

import * as React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { EllipsisIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface QuestionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  difficulty: number;
  location: string;
  onPreview: () => void;
  onEdit: () => void;
  onViewComments: () => void;
  onDelete: () => void;
}

function QuestionItem({
  title,
  difficulty,
  location,
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
        <CardHeader className="whitespace-nowrap truncate block">{title}</CardHeader>
        <CardContent className="flex flex-row gap-4">
          <div className="flex-1">
            <Progress value={difficulty} />
            <span className="text-sm text-dark-gray ml-2">
              Rating: {(difficulty / 100).toFixed(2)}
            </span>
          </div>
        </CardContent>
      </div>
      <div className="flex flex-1 justify-center items-center">
        <Label>{location}</Label>
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
