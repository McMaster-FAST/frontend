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
    "border-2 p-6 rounded-md items-center flex gap-2 w-full transition-all duration-200 ";

  if (!isSubmitSuccess) {
    boxClasses +=
      "border-border peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 ";
    if (!submitted) boxClasses += "hover:bg-muted/50 ";
  } else {
    if (isCorrect) {
      boxClasses += "border-primary-hover ";
    } else if (isWrongSelection) {
      boxClasses += "border-primary ";
    } else {
      boxClasses += "border-border opacity-50 ";
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
        <div className="flex-1">
          <SafeHtml html={resolveImages(option.content, question.public_id)} />
        </div>

        {/* Status Labels and Icons */}
        {isSubmitSuccess && (
          <div className="flex flex-shrink-0 items-center gap-3 ml-4">
            {/* CORRECT OPTION BLOCK */}
            {isCorrect && (
              <div className="flex items-center gap-2 text-primary-hover">
                <span className="text-xs font-bold uppercase tracking-wider">
                  {userGotItRight ? "Great Job!" : "Correct"}
                </span>
                <CheckCircle2 className="h-6 w-6" />
              </div>
            )}

            {/* WRONG SELECTION BLOCK */}
            {isWrongSelection && (
              <div className="flex items-center gap-2 text-primary">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Incorrect
                </span>
                <XCircle className="h-6 w-6" />
              </div>
            )}
          </div>
        )}
      </div>
    </Label>
  );
}
