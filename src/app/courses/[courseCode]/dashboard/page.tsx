"use client";

import { Questions } from "@/app/courses/[courseCode]/dashboard/tabs/questions-tab";
import { MacFastHeader } from "@/components/ui/custom/macfast-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  FileQuestion,
  LayoutDashboard,
  Users,
} from "lucide-react";
import { useCourseData } from "@/hooks/useCourseData";
import { Skeleton } from "@/components/ui/skeleton";
import { ClassList } from "./tabs/class-list-tab";

function InstructorDashboardPage() {
  const { course, isLoading, error } = useCourseData();

  return (
    <div className="min-h-screen bg-slate-50/50 font-poppins">
      <MacFastHeader />

      <div className="border-b border-light-gray bg-white px-6 py-8 shadow-sm">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4">
            <div>
              <div className="mb-2 flex w-full items-center gap-2">
                <Badge variant="secondary" className="font-bold text-dark-gray">
                  {isLoading || !course ? (
                    <Skeleton className="h-4 w-20" />
                  ) : error ? (
                    <span>Unavailable</span>
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
                <Badge
                  variant="secondary"
                  className="ml-auto font-bold text-dark-gray"
                >
                  <LayoutDashboard className="mr-1 inline-block h-4 w-4 text-dark-gray" />
                  Instructor Dashboard
                </Badge>
              </div>

              <h1 className="text-3xl font-bold text-foreground">
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

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Tabs className="w-full" defaultValue="questions">
          <div className="mb-8 overflow-x-auto pb-2 mx-auto">
            <TabsList className="h-12 w-auto justify-start gap-2 bg-transparent p-0">
              <TabsTrigger
                value="questions"
                className="group flex gap-2 rounded-full border border-transparent px-6 py-2 data-[state=active]:border-light-gray data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
              >
                <FileQuestion className="h-4 w-4 text-dark-gray group-data-[state=active]:text-primary-hover" />
                Questions
              </TabsTrigger>

              <TabsTrigger
                value="classList"
                className="group flex gap-2 rounded-full border border-transparent px-6 py-2 data-[state=active]:border-light-gray data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
              >
                <Users className="h-4 w-4 text-dark-gray group-data-[state=active]:text-primary-hover" />
                Class List
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="questions" className="mt-0">
            <Questions />
          </TabsContent>

          <TabsContent value="classList" className="mt-0">
            {course?.code && <ClassList courseCode={course.code} />}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default InstructorDashboardPage;
