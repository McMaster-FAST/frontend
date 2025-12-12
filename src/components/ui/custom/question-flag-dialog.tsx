import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Flag } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useState } from "react"


enum QuestionFlagReason {
  TYPO = "There is a typo",
  ANSWER_NOT_LISTED = "The correct answer is not listed",
  STATED_ANSWER_INCORRECT = "The stated correct answer is incorrect",
  NONSENSE = "The question does not make sense",
  OTHER = "Other",
}

interface QuestionFlagDialogProps {
  onSubmit: (reasons: QuestionFlagReason[]) => void;
}
export function QuestionFlagDialog({ onSubmit }: QuestionFlagDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<QuestionFlagReason[]>([]);

  const handleSubmitReport = () => {
    setOpen(false);
    onSubmit(selectedReasons);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button variant="primary" iconOnly leftIcon={Flag} />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Flag Question</DialogTitle>
            <DialogDescription>
              Please select a reason.
            </DialogDescription>
          </DialogHeader>
          {Object.entries(QuestionFlagReason).map(([key, reason]) => (
            <div key={key} className="inline-flex gap-2">
              <Checkbox id={key} checked={selectedReasons.includes(key as QuestionFlagReason)} onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedReasons([...selectedReasons, key as QuestionFlagReason]);
                } else {
                  setSelectedReasons(selectedReasons.filter(reason => reason !== key));
                }
              }} />
              <Label htmlFor={key}>{reason}</Label>
            </div>
          ))}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={handleSubmitReport} disabled={selectedReasons.length === 0}>Report</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
