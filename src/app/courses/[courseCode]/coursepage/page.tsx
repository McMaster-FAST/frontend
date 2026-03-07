"use client";

import { MacFastHeader } from "@/components/ui/custom/macfast-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UnitsAccordion from "@/components/ui/custom/unit-accordion/unit-accordion";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  AlertTriangle,
  BookOpen,
  GraduationCap,
  LineChart,
  ListChecks,
} from "lucide-react";
import { useCourseData } from "@/hooks/useCourseData";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { UnitsAccordionSkeleton } from "@/components/ui/custom/unit-accordion/unit-accordion-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
          <TabsList>
            <TabsTrigger value="practiceProblems">
              <BookOpen />
              Practice Problems
            </TabsTrigger>

            <TabsTrigger value="learningObjectives">
              <ListChecks />
              Learning Objectives
            </TabsTrigger>

            <TabsTrigger value="statistics">
              <LineChart />
              Statistics
            </TabsTrigger>

            <TabsTrigger value="savedQuestions">
              <GraduationCap />
              Saved Questions
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="practiceProblems"
            className="mt-0 flex-1 overflow-y-auto min-h-0 pr-2"
          >
            <div className="flex flex-col gap-4">
              <div className="mb-2">
                <h2 className="text-lg font-semibold text-slate-800">
                  Unit Breakdown
                </h2>
                <p className="text-sm text-dark-gray">
                  Select a unit to view practice problems.
                </p>
              </div>
              {isLoading || !course ? (
                <div>
                  <UnitsAccordionSkeleton />
                </div>
              ) : error ? (
                <Alert
                  variant="destructive"
                  className="mt-4 bg-red-50 border-red-200 text-red-900"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Unable to load units</AlertTitle>
                  <AlertDescription>
                    There was a problem retrieving the course content. Please
                    try refreshing the page.
                  </AlertDescription>
                </Alert>
              ) : (
                <UnitsAccordion
                  key={course.code}
                  course={course}
                  tab="practiceProblems"
                  value={openUnits}
                  setValue={setOpenUnits}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent
            value="learningObjectives"
            className="mt-0 flex-1 overflow-y-auto min-h-0 pr-2"
          >
            <div className="flex flex-col gap-4">
              <div className="mb-2">
                <h2 className="text-lg font-semibold text-slate-800">
                  Learning Objectives
                </h2>
                <p className="text-sm text-dark-gray">
                  Click on a unit to view detailed learning objectives.
                </p>
              </div>
              {isLoading || !course ? (
                <UnitsAccordionSkeleton />
              ) : error ? (
                <Alert
                  variant="destructive"
                  className="mt-4 bg-red-50 border-red-200 text-red-900"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Unable to load units</AlertTitle>
                  <AlertDescription>
                    There was a problem retrieving the course content. Please
                    try refreshing the page.
                  </AlertDescription>
                </Alert>
              ) : (
                <UnitsAccordion
                  key={course.code + "-lo"}
                  course={course}
                  tab="learningObjectives"
                  value={openUnits}
                  setValue={setOpenUnits}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent
            value="statistics"
            className="mt-0 flex-1 overflow-y-auto min-h-0 pr-2"
          >
            <div className="rounded-lg border border-dashed border-light-gray p-10 text-center text-dark-gray">
              Statistics Dashboard Coming Soon
            </div>
          </TabsContent>

          <TabsContent
            value="savedQuestions"
            className="mt-0 flex-1 overflow-y-auto min-h-0 pr-2"
          >
            <div className="rounded-lg border border-dashed border-light-gray p-10 text-center text-dark-gray">
              No saved questions yet.
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default CoursePage;
