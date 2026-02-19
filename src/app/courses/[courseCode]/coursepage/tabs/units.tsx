import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import UnitsAccordion from "@/components/ui/custom/unit-accordion/unit-accordion";
import { UnitsAccordionSkeleton } from "@/components/ui/custom/unit-accordion/unit-accordion-skeleton";
import { TabsContent } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";

interface UnitsTabProps {
  course?: Course;
  isLoading: boolean;
  error?: Error;
  openUnits: string;
  setOpenUnits: (value: string) => void;
}

export default function UnitsTab({
  course,
  isLoading,
  error,
  openUnits,
  setOpenUnits,
}: UnitsTabProps) {
  return (
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
              There was a problem retrieving the course content. Please try
              refreshing the page.
            </AlertDescription>
          </Alert>
        ) : (
          <UnitsAccordion
            key={course.code}
            units={course.units}
            course={course}
            tab="practiceProblems"
            value={openUnits}
            setValue={setOpenUnits}
          />
        )}
      </div>
    </TabsContent>
  );
}
