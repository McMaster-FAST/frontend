import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { SafeHtml } from "@/components/macfast/safe-html";
import { resolveImages } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";

interface QuestionOptionProps {
  option: TestQuestionOption;
  correctOptionId: string | null;
  submitted: boolean;
  isSubmitSuccess: boolean;
  selectedOption: string | null;
  question: TestQuestion;
}

export default function QuestionOption({
  option,
  correctOptionId,
  submitted,
  isSubmitSuccess,
  selectedOption,
  question,
}: QuestionOptionProps) {
  const isCorrect = option.public_id === correctOptionId;
  const isSelected = option.public_id === selectedOption;
  const isWrongSelection = isSelected && !isCorrect;

  // Did the user successfully answer the whole question?
  const userGotItRight = selectedOption === correctOptionId;

  let boxClasses =
    "border-2 p-6 rounded-md items-start flex gap-2 w-full transition-all duration-200 ";

  if (!isSubmitSuccess) {
    boxClasses +=
      "border-border peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 ";
    if (!submitted) boxClasses += "hover:bg-muted/50 ";
  } else {
    if (isCorrect) {
      boxClasses += "border-green-500 bg-green-50 dark:bg-green-950/40 ";
    } else if (isWrongSelection) {
      boxClasses += "border-red-500 bg-red-50 dark:bg-red-950/40 ";
    } else {
      boxClasses += "border-border opacity-40 ";
    }
  }

  return (
    <Label
      key={option.public_id}
      htmlFor={option.public_id}
      className={`w-full ${submitted ? "cursor-default" : "cursor-pointer"}`}
    >
      <RadioGroupItem
        value={option.public_id}
        id={option.public_id}
        className="sr-only peer"
        disabled={submitted}
      />

      <div className={boxClasses}>
        <div className="min-w-0 flex-1">
          <SafeHtml html={resolveImages(option.content, question.public_id)} />
        </div>
        <span className="ml-auto shrink-0">
          {isSubmitSuccess && isCorrect ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : isSubmitSuccess && isWrongSelection ? (
            <XCircle className="h-5 w-5 text-red-500" />
          ) : (
            <span className="block h-5 w-5" />
          )}
        </span>
      </div>
    </Label>
  );
}
