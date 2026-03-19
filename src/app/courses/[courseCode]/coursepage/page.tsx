"use client";

import { MacFastHeader } from "@/components/macfast/macfast-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UnitsAccordion from "@/components/macfast/unit-accordion/unit-accordion";
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
import { UnitsAccordionSkeleton } from "@/components/macfast/unit-accordion/unit-accordion-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CourseBanner } from "@/components/macfast/course-banner/course-banner";

function CoursePage() {
  const { course, isLoading, error } = useCourseData();
  const [openUnits, setOpenUnits] = useState<string>("");

  return (
    <div className="h-screen flex flex-col overflow-hidden font-poppins">
      <MacFastHeader />

      <CourseBanner
        course={course}
        isLoading={isLoading}
        error={error}
        variant="course"
        level={3}
        progressPercentage={90}
      />

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
                <h2 className="text-lg font-semibold">Unit Breakdown</h2>
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
