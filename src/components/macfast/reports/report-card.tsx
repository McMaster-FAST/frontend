import { getTimeString } from "@/lib/time-utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/dist/client/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const REPORT_DETAILS_MAX_LENGTH = 200 - 3; // Room for ellipses

interface ReportCardProps {
  report: QuestionReport;
}

export default function ReportCard({ report }: ReportCardProps) {
  const [isSeeMore, setIsSeeMore] = useState(false);
  const [areDetailsTruncated, setAreDetailsTruncated] = useState(false);
  const [truncatedAdditionalDetails, setTruncatedAdditionalDetails] =
    useState("");

  useEffect(() => {
    if (report.additional_details.length > REPORT_DETAILS_MAX_LENGTH) {
      setTruncatedAdditionalDetails(
        report.additional_details.slice(0, REPORT_DETAILS_MAX_LENGTH) + "...",
      );
      setAreDetailsTruncated(true);
    } else {
      setTruncatedAdditionalDetails(report.additional_details);
    }
  }, [report.additional_details]);

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
            <CardDescription className="transition-all duration-300 ease-in-out overflow-hidden flex flex-col gap-2">
              <div className="inline-flex flex-wrap gap-1 items-center">
                <span className="font-bold">Reason(s):</span>
                {report.report_reasons.map((reason) => (
                  <Badge key={reason} variant="secondary">
                    {reason}
                  </Badge>
                ))}
              </div>

              <div>
                <span className="font-bold">Additional details:</span>{" "}
                {isSeeMore
                  ? report.additional_details.trim() || "None provided"
                  : truncatedAdditionalDetails}
              </div>
              {report.user && report.user.email && (
                <div>
                  <span className="font-bold">Contact email: </span>
                  <Link
                    className="clickable-text"
                    href={`mailto:${report.user.email}?subject=Re: MacFAST question report`} // TODO: Populate the question content here.
                  >
                    {report.user.email}
                  </Link>
                </div>
              )}
            </CardDescription>
            <CardFooter className="text-sm gap-2 flex flex-row mt-2 justify-between">
              {areDetailsTruncated && (
                <span
                  onClick={() => setIsSeeMore(!isSeeMore)}
                  className="text-button"
                >
                  {isSeeMore ? "See less" : "See more"}
                </span>
              )}
            </CardFooter>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
