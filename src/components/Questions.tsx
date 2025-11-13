"use client";

import { useState } from "react";
import { QuestionButton } from "./ui/question-button";
import { QuestionItem } from "./ui/questions-item";

const mockQuestions = [
  {
    id: "1",
    title: "What is your favourite flavour of ice cream",
    difficulty: 95,
  },
  {
    id: "2",
    title:
      "This is a super long question that has a lot of text in it and will...",
    difficulty: 95,
  },
  { id: "3", title: "Question #", difficulty: 95 },
  { id: "4", title: "Question #", difficulty: 95 },
  { id: "5", title: "Question #", difficulty: 95 },
];

export function Questions() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-8 bg-off-white min-h-screen">
      <h2 className="text-2xl font-bold text-dark-gray mb-6">
        Hello, {"<instructor_name>"}
      </h2>

      <div className="flex gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border border-light-gray rounded-md focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon"
        />
        <button className="bg-maroon text-white px-6 py-2 rounded-md hover:bg-maroon/90">
          →
        </button>
        <div className="ml-auto flex gap-3">
          <QuestionButton
            variant="upload"
            onClick={() => console.log("Upload")}
          >
            Upload Questions
          </QuestionButton>
          <button className="p-2 border border-light-gray rounded-md hover:bg-off-white">
            <svg
              className="w-5 h-5 text-dark-gray"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </button>
        </div>
      </div>

      {mockQuestions.map((question) => (
        <QuestionItem
          key={question.id}
          title={question.title}
          difficulty={question.difficulty}
          onPreview={() => console.log("Preview:", question.id)}
          onEdit={() => console.log("Edit:", question.id)}
        />
      ))}
    </div>
  );
}
