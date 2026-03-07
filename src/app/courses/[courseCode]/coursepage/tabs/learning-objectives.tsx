import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import UnitsAccordion from "@/components/ui/custom/unit-accordion/unit-accordion";
import { UnitsAccordionSkeleton } from "@/components/ui/custom/unit-accordion/unit-accordion-skeleton";
import { TabsContent } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";

interface LearningObjectivesTabProps {
  course?: Course;
  isLoading: boolean;
  error?: Error;
  openUnits: string;
  setOpenUnits: (value: string) => void;
}

export default function LearningObjectivesTab({
  course,
  isLoading,
  error,
  openUnits,
  setOpenUnits,
}: LearningObjectivesTabProps) {
  return (
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
              There was a problem retrieving the course content. Please try
              refreshing the page.
            </AlertDescription>
          </Alert>
        ) : (
          <UnitsAccordion
            key={course.code + "-lo"}
            units={course.units}
            course={course}
            tab="learningObjectives"
            value={openUnits}
            setValue={setOpenUnits}
          />
        )}
      </div>
    </TabsContent>
  );
}
