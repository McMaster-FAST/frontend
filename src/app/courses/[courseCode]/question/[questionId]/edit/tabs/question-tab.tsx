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
      <div className="flex flex-col gap-4 h-full overflow-auto">
        <div className="flex flex-col gap-6">
          <div className="flex-1 flex-col gap-2">
            <h2 className="text-lg font-semibold">Question Content</h2>
            <Label className="text-sm font-light">
              What the student will be asked
            </Label>
            <RichTextarea
              value={question?.content ?? ""}
              placeholder="Question content..."
              onChange={(content) =>
                setQuestion((prev) => (prev ? { ...prev, content } : prev))
              }
            />
          </div>
          <div className="flex-1 flex-col gap-2">
            <h2 className="text-lg font-semibold">Question Details</h2>
            <div>
              <div className="inline-flex items-center gap-4">
                <Label htmlFor="is-verified">Status:</Label>
              </div>
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
              <Label className="text-sm font-light">
                Whether the question is ready to be shown to students.
              </Label>
            </div>
            <div className="items-center gap-2">
              <div className="inline-flex items-center gap-2">
                <Label htmlFor="difficulty">Difficulty: </Label>
              </div>
              <Input
                className="w-24"
                value={question?.difficulty ?? "0.0000"}
                disabled
                readOnly
              />
              <Label className="text-sm font-light">
                The difficulty of the question as given on question upload.
              </Label>
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  );
}
