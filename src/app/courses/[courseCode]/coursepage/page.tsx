"use client";

import { MacFastHeader } from "@/components/ui/custom/macfast-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  BookOpen,
  GraduationCap,
  LineChart,
  ListChecks,
} from "lucide-react";
import { useCourseData } from "@/hooks/useCourseData";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import StatisticsTab from "./tabs/statistics";
import LearningObjectivesTab from "./tabs/learning-objectives";
import UnitsTab from "./tabs/units";
import SavedQuestionsTab from "./tabs/saved-questions";

function CoursePage() {
  const { course, isLoading, error } = useCourseData();
  const [openUnits, setOpenUnits] = useState<string>("");

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50/50 font-poppins">
      <MacFastHeader />
      <div className="border-b border-light-gray bg-white px-6 py-8 shadow-sm shrink-0">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="font-poppins font-bold text-dark-gray"
                >
                  {isLoading || !course ? (
                    <Skeleton className="h-4 w-20" />
                  ) : error ? (
                    <span>Course unavailable</span>
                  ) : (
                    course.code
                  )}
                </Badge>
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {isLoading || !course ? (
                    <Skeleton className="h-4 w-20" />
                  ) : error ? null : (
                    course.semester
                  )}
                </span>
              </div>
              <h1 className="font-poppins text-3xl font-bold text-foreground">
                {isLoading || !course ? (
                  <Skeleton className="h-16 w-120" />
                ) : error ? (
                  <span className="text-red-900">
                    <AlertTriangle className="mr-2 inline-block" />
                    Error loading course
                  </span>
                ) : (
                  course.name
                )}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-7xl px-6 py-8 flex-1 flex flex-col min-h-0">
        <Tabs
          className="w-full flex flex-col h-full"
          defaultValue="practiceProblems"
        >
          <div className="mb-8 overflow-x-auto pb-2 mx-auto shrink-0 w-full flex justify-start md:justify-center">
            {" "}
            <TabsList className="h-12 gap-2 bg-transparent p-0 border-dark-gray">
              <TabsTrigger
                value="practiceProblems"
                className="group flex gap-2 rounded-full border border-transparent px-6 py-2 data-[state=active]:border-light-gray data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
              >
                <BookOpen className="h-4 w-4 text-dark-gray group-data-[state=active]:text-primary-hover" />
                Practice Problems
              </TabsTrigger>

              <TabsTrigger
                value="learningObjectives"
                className="group flex gap-2 rounded-full border border-transparent px-6 py-2 data-[state=active]:border-light-gray data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
              >
                <ListChecks className="h-4 w-4 text-dark-gray group-data-[state=active]:text-primary-hover" />
                Learning Objectives
              </TabsTrigger>

              <TabsTrigger
                value="statistics"
                className="group flex gap-2 rounded-full border border-transparent px-6 py-2 data-[state=active]:border-light-gray data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
              >
                <LineChart className="h-4 w-4 text-dark-gray group-data-[state=active]:text-primary-hover" />
                Statistics
              </TabsTrigger>

              <TabsTrigger
                value="savedQuestions"
                className="group flex gap-2 rounded-full border border-transparent px-6 py-2 data-[state=active]:border-light-gray data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
              >
                <GraduationCap className="h-4 w-4 text-dark-gray group-data-[state=active]:text-primary-hover" />
                Saved Questions
              </TabsTrigger>
            </TabsList>
          </div>
          <UnitsTab
            course={course}
            isLoading={isLoading}
            error={error}
            openUnits={openUnits}
            setOpenUnits={setOpenUnits}
          />
          <LearningObjectivesTab
            course={course}
            isLoading={isLoading}
            error={error}
            openUnits={openUnits}
            setOpenUnits={setOpenUnits}
          />
          <StatisticsTab />

          <SavedQuestionsTab courseCode={course?.code || ""} />
        </Tabs>
      </main>
    </div>
  );
}

export default CoursePage;
