import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { SafeHtml } from "@/components/macfast/safe-html";
import { resolveImages } from "@/lib/utils";

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

  let boxClasses =
    "border-2 p-6 rounded-md items-center flex gap-2 w-full transition-all duration-200 ";

  if (!isSubmitSuccess) {
    boxClasses +=
      "border-border peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 ";
    if (!submitted) boxClasses += "hover:bg-muted/50 ";
  } else {
    if (isCorrect) {
      boxClasses += "border-primary-hover";
    } else if (isWrongSelection) {
      boxClasses += "border-primary";
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
        <SafeHtml html={resolveImages(option.content, question.public_id)} />
      </div>
    </Label>
  );
}
