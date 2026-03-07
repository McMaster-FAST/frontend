"use client";

import { MacFastHeader } from "@/components/ui/custom/macfast-header";
import React from "react";

interface QuestionPageLayoutProps {
  title: React.ReactNode;
  children: React.ReactNode;
  bottomBarActions: React.ReactNode;
}

export function QuestionPageLayout({
  title,
  children,
  bottomBarActions,
}: QuestionPageLayoutProps) {
  return (
    <div className="flex flex-col h-screen">
      <MacFastHeader />
      <div id="content" className="flex flex-col gap-4 p-8 flex-1">
        <div
          id="header"
          className="flex flex-row font-poppins font-semibold text-xl items-center gap-2 text-dark-gray"
        >
          {title}
        </div>
        {children}
      </div>
      <footer className="flex flex-row gap-4 sticky bottom-0 left-0 w-full p-4 border-t-2 bg-white">
        {bottomBarActions}
      </footer>
    </div>
  );
}
