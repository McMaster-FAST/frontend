import { RichTextarea } from "@/components/editor/rich-textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";

interface QuestionTabProps {
  question: Question | null;
  setQuestion: React.Dispatch<React.SetStateAction<Question | null>>;
}

export default function QuestionTab({
  question,
  setQuestion,
}: QuestionTabProps) {
  const updateVerifiedStatus = (value: string) => {
    const isVerified = value === "true";
    setQuestion((prev) => (prev ? { ...prev, is_verified: isVerified } : prev));
  };

  return (
    <TabsContent value="question" className="flex-1 overflow-hidden">
      <div className="flex flex-col gap-8 h-full overflow-auto pb-6">
        {/* Question Details Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-foreground border-b border-light-gray pb-2">
            Question Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Status */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="is-verified"
                className="text-md font-semibold text-foreground"
              >
                Status
              </Label>
              <Select
                value={question?.is_verified?.toString() || "false"}
                onValueChange={updateVerifiedStatus}
              >
                <SelectTrigger
                  id="is-verified"
                  onClick={(e) => e.stopPropagation()}
                >
                  <SelectValue
                    placeholder={
                      question?.is_verified ? "Verified" : "Unverified"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Verified</SelectItem>
                  <SelectItem value="false">Unverified</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Whether the question is ready to be shown to students.
              </p>
            </div>

            {/* Difficulty */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="difficulty"
                className="text-md font-semibold text-foreground"
              >
                Difficulty
              </Label>
              <Input
                id="difficulty"
                className="w-1/4 bg-slate-50/50"
                value={question?.difficulty ?? "0.0000"}
                disabled
                readOnly
              />
              <p className="text-xs text-muted-foreground">
                The difficulty of the question as given on question upload.
              </p>
            </div>

            {/* Unit */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="unit"
                className="text-md font-semibold text-foreground"
              >
                Unit
              </Label>
              <Select
                value={question?.unit || ""}
                onValueChange={(val) =>
                  setQuestion((prev) => (prev ? { ...prev, unit: val } : prev))
                }
              >
                <SelectTrigger id="unit">
                  <SelectValue placeholder="Select a unit" />
                </SelectTrigger>
                <SelectContent>
                  {/* Replace with actual unit data map if dynamic */}
                  <SelectItem value="unit-1">Unit 1</SelectItem>
                  <SelectItem value="unit-2">Unit 2</SelectItem>
                  <SelectItem value="unit-3">Unit 3</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                The primary unit this question is categorized under.
              </p>
            </div>

            {/* Subtopic */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="subtopic"
                className="text-md font-semibold text-foreground"
              >
                Subtopic
              </Label>
              <Select
                value={question?.subtopic_name || ""}
                onValueChange={(val) =>
                  setQuestion((prev) =>
                    prev ? { ...prev, subtopic: val } : prev,
                  )
                }
              >
                <SelectTrigger id="subtopic">
                  <SelectValue placeholder="Select a subtopic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subtopic-1">Subtopic 1</SelectItem>
                  <SelectItem value="subtopic-2">Subtopic 2</SelectItem>
                  <SelectItem value="subtopic-3">Subtopic 3</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                The specific subtopic for this question.
              </p>
            </div>
          </div>
        </div>
        {/* Question Content Section */}
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Question Content
            </h2>
            <p className="text-sm text-muted-foreground">
              What the student will be asked
            </p>
          </div>
          <RichTextarea
            value={question?.content ?? ""}
            placeholder="Question content..."
            onChange={(content) =>
              setQuestion((prev) => (prev ? { ...prev, content } : prev))
            }
          />
        </div>
      </div>
    </TabsContent>
  );
}
