"use client";

import { Questions } from "@/app/courses/[courseCode]/dashboard/tabs/questions-tab";
import { MacFastHeader } from "@/components/macfast/macfast-header";
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
import { CourseBanner } from "@/components/macfast/course-header/course-header";

function InstructorDashboardPage() {
  const { course, isLoading, error } = useCourseData();

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50/50 font-poppins">
      <MacFastHeader />

      <CourseBanner course={course} isLoading={isLoading} error={error} />

      <main className="mx-auto w-full max-w-7xl px-6 py-8 flex-1 flex flex-col min-h-0">
        <Tabs className="w-full flex flex-col h-full" defaultValue="questions">
          <div className="mb-8 overflow-x-auto pb-2 mx-auto">
            <TabsList className="h-12 w-auto justify-start gap-2 p-0">
              <TabsTrigger value="questions">
                <FileQuestion />
                Questions
              </TabsTrigger>

              <TabsTrigger value="classList">
                <Users />
                Class List
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="questions"
            className="flex-1 flex flex-col min-h-0 mt-0"
          >
            <Questions course={course} />
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
