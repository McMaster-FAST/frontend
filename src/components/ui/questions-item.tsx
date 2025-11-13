"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { DifficultyBar } from "./difficulty-bar";
import { QuestionButton } from "./question-button";

interface QuestionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  difficulty: number;
  onPreview: () => void;
  onEdit: () => void;
}

function QuestionItem({
  title,
  difficulty,
  onPreview,
  onEdit,
  className,
  ...props
}: QuestionItemProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg p-6 mb-3 shadow-sm flex justify-between items-center",
        className
      )}
      {...props}
    >
      <div className="flex-1 flex items-center">
        <span className="font-medium text-dark-gray flex-1">{title}</span>
        <div className="mx-6 flex-shrink-0 w-48">
          <DifficultyBar
            difficulty={difficulty}
            maxDifficulty={100}
            showLabel={false}
          />
        </div>
        <span className="text-sm text-dark-gray ml-2">
          Difficulty: {(difficulty / 100).toFixed(2)}
        </span>
      </div>
      <div className="flex gap-3 ml-4">
        <QuestionButton variant="preview" onClick={onPreview}>
          Preview
        </QuestionButton>
        <QuestionButton variant="edit" onClick={onEdit}>
          Edit
        </QuestionButton>
      </div>
    </div>
  );
}

export { QuestionItem };
