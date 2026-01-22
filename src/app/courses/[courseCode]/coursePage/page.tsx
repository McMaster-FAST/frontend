"use client";

import { MacFastHeader } from "@/components/ui/custom/macfast-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UnitsAccordion from "@/components/ui/custom/unit-accordion";
import { Badge } from "@/components/ui/badge";
import { BookOpen, GraduationCap, LineChart, ListChecks } from "lucide-react";
import { useCourseData } from "@/hooks/useCourseData";
import { useState } from "react";

function CoursePage() {
  const { course, isLoading, error } = useCourseData();
  const [openUnitIds, setOpenUnitIds] = useState<string[]>([]);

  // While loading should be a Skeleton I think or maybe a spinner
  if (isLoading) return <div>Loading...</div>;
  if (error || !course) return <div>Error loading course data.</div>;

  return (
    <div className="min-h-screen bg-slate-50/50 font-poppins">
      <MacFastHeader />
      <div className="border-b border-light-gray bg-white px-6 py-8 shadow-sm">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="font-poppins font-bold text-dark-gray"
                >
                  {course.code}
                </Badge>
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Fall 2025
                </span>
              </div>
              <h1 className="font-poppins text-3xl font-bold text-foreground">
                {course.name}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Tabs className="w-full" defaultValue="practiceProblems">
          <div className="mb-8 overflow-x-auto pb-2 mx-auto">
            {" "}
            <TabsList className="h-12 mx-auto justify-start gap-2 bg-transparent md:w-auto p-0 max-w-5xl border-dark-gray">
              <TabsTrigger
                value="practiceProblems"
                className="group flex gap-2 rounded-full border border-transparent px-6 py-2 data-[state=active]:border-light-gray data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
              >
                <BookOpen className="h-4 w-4 text-slate-400 group-data-[state=active]:text-primary-hover" />
                Practice Problems
              </TabsTrigger>

              <TabsTrigger
                value="learningObjectives"
                className="group flex gap-2 rounded-full border border-transparent px-6 py-2 data-[state=active]:border-light-gray data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
              >
                <ListChecks className="h-4 w-4 text-slate-400 group-data-[state=active]:text-primary-hover" />
                Learning Objectives
              </TabsTrigger>

              <TabsTrigger
                value="statistics"
                className="group flex gap-2 rounded-full border border-transparent px-6 py-2 data-[state=active]:border-light-gray data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
              >
                <LineChart className="h-4 w-4 text-slate-400 group-data-[state=active]:text-primary-hover" />
                Statistics
              </TabsTrigger>

              <TabsTrigger
                value="savedQuestions"
                className="group flex gap-2 rounded-full border border-transparent px-6 py-2 data-[state=active]:border-light-gray data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
              >
                <GraduationCap className="h-4 w-4 text-slate-400 group-data-[state=active]:text-primary-hover" />
                Saved Questions
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="practiceProblems" className="mt-0">
            <div className="flex flex-col gap-4">
              <div className="mb-2">
                <h2 className="text-lg font-semibold text-slate-800">
                  Unit Breakdown
                </h2>
                <p className="text-sm text-slate-500">
                  Select a unit to view practice problems.
                </p>
              </div>
              {course.units.map((unit, index) => (
                <UnitsAccordion
                  key={index}
                  units={[unit]}
                  course={course}
                  tab="practiceProblems"
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="learningObjectives" className="mt-0">
            <div className="flex flex-col gap-4">
              <div className="mb-2">
                <h2 className="text-lg font-semibold text-slate-800">
                  Learning Objectives
                </h2>
                <p className="text-sm text-dark-gray">
                  Click on a unit to view detailed learning objectives.
                </p>
              </div>
              {course.units.map((unit, index) => (
                <UnitsAccordion
                  key={index}
                  units={[unit]}
                  course={course}
                  tab="learningObjectives"
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="statistics">
            <div className="rounded-lg border border-dashed border-slate-300 p-10 text-center text-slate-500">
              Statistics Dashboard Coming Soon
            </div>
          </TabsContent>

          <TabsContent value="savedQuestions">
            <div className="rounded-lg border border-dashed border-slate-300 p-10 text-center text-slate-500">
              No saved questions yet.
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default CoursePage;
