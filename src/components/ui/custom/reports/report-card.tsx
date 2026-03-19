import { getTimeString } from "@/lib/time-utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "../../card";
import { Badge } from "../../badge";
import Link from "next/dist/client/link";

interface ReportCardProps {
  report: QuestionReport;
}
export default function ReportCard({ report }: ReportCardProps) {
  return (
    <div className="flex flex-row w-full gap-2">
      <div className="flex flex-col gap-2 w-full">
        <Card className="w-full px-4">
          <CardContent>
            <CardTitle className="flex justify-between items-center text-foreground">
              <div className="inline-flex items-center gap-2 text-sm">
                {report.user ? report.user.username : "Anonymous"}
              </div>

              <p className="text-sm text-muted-foreground">
                {getTimeString(report.timestamp)}
              </p>
            </CardTitle>
            <CardDescription className="transition-all duration-300 ease-in-out overflow-hidden">
              <div>
                <div className="inline-flex flex-wrap gap-1 items-center">
                  <span className="font-bold">Reason(s):</span>
                  {report.report_reasons.map((reason) => (
                    <Badge key={reason} variant="secondary">
                      {reason}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-bold">Additional details:</span>
                {report.additional_details || "None"}
              </div>
              {report.user && report.user.email && (
                <div>
                  <span className="font-bold">Contact email:{" "}</span>
                  <Link className="text-primary underline" href={`mailto:${report.user.email}?subject=Regarding your MacFast question report`}>
                    {report.user.email}
                  </Link>
                </div>
              )}

            </CardDescription>
            <CardFooter className="text-sm gap-2 flex flex-row"></CardFooter>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
