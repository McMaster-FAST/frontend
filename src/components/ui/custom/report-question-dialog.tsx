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



enum QuestionFlagReason {
  TEXT_FORMATTING = "Formatting of text",
  IMAGE_FORMATTING = "Formatting of images",
  INCORRECT_IMAGES = "Images were incorrect",
  SOLUTION_INCORRECT = "Solution incorrect or confusing",
  QUESTION_INCORRECT = "Question incorrect or confusing",
  OTHER = "Other",
}

interface QuestionFlagDialogProps {
  onSubmit?: (reasons: QuestionFlagReason[]) => void;
  disabled?: boolean;
}

interface ReportAnswers {
  reasons: QuestionFlagReason[];
  additionalDetails: string;
  email: string;
}

interface FormValidityState {
  reasons: boolean;
  email: boolean;
  additionalDetails: boolean;
}

export function QuestionFlagDialog({ onSubmit, disabled }: QuestionFlagDialogProps) {
  const [open, setOpen] = useState(false);
  const [reportAnswers, setReportAnswers] = useState<ReportAnswers>({
    reasons: [],
    additionalDetails: "",
    email: "",
  });

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(reportAnswers.reasons);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button variant="secondary" disabled={disabled}>
            Report question
            <AlertTriangle className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Report Question</DialogTitle>
            <DialogDescription>Please select a reason.</DialogDescription>
          </DialogHeader>
          {Object.entries(QuestionFlagReason).map(([key, reason]) => (
            <div key={key} className="inline-flex gap-2">
              <Checkbox
                id={key}
                checked={reportAnswers.reasons.includes(key as QuestionFlagReason)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setReportAnswers({
                      ...reportAnswers,
                      reasons: [...reportAnswers.reasons, key as QuestionFlagReason],
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
            id="additional-details"
            placeholder="Additional details"
            className="mt-2"
            value={reportAnswers.additionalDetails}
            onChange={(e) => setReportAnswers({
              ...reportAnswers,
              additionalDetails: e.target.value
            })}
          />
          <Label htmlFor="email" className="mt-4">
            Can we reach out to you if we have more questions? Please provide
            your student email if you can; otherwise, leave this blank.
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Email address"
            className="mt-2"
            value={reportAnswers.email}
            onChange={(e) => setReportAnswers({
              ...reportAnswers,
              email: e.target.value
            })}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              onClick={handleSubmitReport}
              disabled={reportAnswers.reasons.length === 0}
            >
              Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
