import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { QuestionReportReason } from "@/types/QuestionReportReason";

interface QuestionFlagDialogProps {
  onSubmit?: (reportAnswers: ReportAnswers) => (Promise<void> | void);
  disabled?: boolean;
}

interface ReportAnswers {
  reasons: QuestionReportReason[];
  additionalDetails: string;
  contact_consent: boolean;
}

interface FormValidityState {
  reasons: boolean;
  email: boolean;
  additionalDetails: boolean;
}

export function ReportQuestionDialog({
  onSubmit,
  disabled,
}: QuestionFlagDialogProps) {
  const [reportAnswers, setReportAnswers] = useState<ReportAnswers>({
    reasons: [],
    additionalDetails: "",
    contact_consent: false,
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  

  const resetState = () => {
    setReportAnswers({
      reasons: [],
      additionalDetails: "",
      contact_consent: false,
    });
  };
  const handleSubmitReport = async () => {
    setSubmitLoading(true);
    await onSubmit?.(reportAnswers);
    resetState();
    setSubmitLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" disabled={disabled}>
          Report question
          <AlertTriangle className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Question</DialogTitle>
          <DialogDescription>Please select a reason.</DialogDescription>
        </DialogHeader>
        {Object.entries(QuestionReportReason).map(([key, reason]) => (
          <div key={key} className="inline-flex gap-2">
            <Checkbox
              id={key}
              checked={reportAnswers.reasons.includes(
                key as QuestionReportReason,
              )}
              onCheckedChange={(checked) => {
                if (checked) {
                  setReportAnswers({
                    ...reportAnswers,
                    reasons: [
                      ...reportAnswers.reasons,
                      key as QuestionReportReason,
                    ],
                  });
                } else {
                  setReportAnswers({
                    ...reportAnswers,
                    reasons: reportAnswers.reasons.filter(
                      (reason) => reason !== key,
                    ),
                  });
                }
              }}
            />
            <Label htmlFor={key}>{reason}</Label>
          </div>
        ))}
        <Label htmlFor="additional-details" className="mt-4">
          Please provide more details. For example, if there is a problem with
          the question or solution, be specific about what you think is wrong.
        </Label>
        <Input
          required
          id="additional-details"
          placeholder="Additional details"
          className="mt-2"
          value={reportAnswers.additionalDetails}
          onChange={(e) =>
            setReportAnswers({
              ...reportAnswers,
              additionalDetails: e.target.value,
            })
          }
        />
        <div className="inline-flex items-center">
          <Checkbox
            id="contact-consent"
            checked={reportAnswers.contact_consent}
            onCheckedChange={(checked) =>
              setReportAnswers({
                ...reportAnswers,
                contact_consent: checked as boolean,
              })
            }
          />
          <Label htmlFor="contact-consent" className="ml-2">
            I consent to being contacted with any follow-up questions (optional)
          </Label>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={handleSubmitReport}
            disabled={reportAnswers.reasons.length === 0 || submitLoading}
            isLoading={submitLoading}
          >
            Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
