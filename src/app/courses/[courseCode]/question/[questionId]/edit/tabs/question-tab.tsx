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
  units?: Unit[];
  selectedUnitPublicId?: string;
  selectedSubtopicPublicId?: string;
  onUnitChange?: (unitPublicId: string) => void;
  onSubtopicChange?: (subtopicPublicId: string) => void;
  allowDifficultySelection?: boolean;
}

export default function QuestionTab({
  question,
  setQuestion,
  units,
  selectedUnitPublicId,
  selectedSubtopicPublicId,
  onUnitChange,
  onSubtopicChange,
  allowDifficultySelection = false,
}: QuestionTabProps) {
  const updateVerifiedStatus = (value: string) => {
    const isVerified = value === "true";
    setQuestion((prev) => (prev ? { ...prev, is_verified: isVerified } : prev));
  };

  const availableUnits = units ?? [];
  const selectedUnit =
    availableUnits.find((unit) => unit.public_id === selectedUnitPublicId) ??
    null;
  const availableSubtopics = selectedUnit?.subtopics ?? [];

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

            {/* Correct Answer Rate / Difficulty */}
            {(() => {
              if (question && question.selection_frequency > 0) {
                return (
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="selection-frequency"
                      className="text-md font-semibold text-foreground"
                    >
                      Correct Answer Rate
                    </Label>
                    <Input
                      id="selection-frequency"
                      className="w-1/4"
                      value={question.selection_frequency}
                      disabled
                      readOnly
                    />
                    <p className="text-xs text-muted-foreground">
                      The percentage of students who answered this question correctly.
                    </p>
                  </div>
                );
              } else {
                return (
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="difficulty"
                      className="text-md font-semibold text-foreground"
                    >
                      Difficulty
                    </Label>
                    {allowDifficultySelection ? (
                      <Select
                        value={Number(question?.difficulty ?? 0).toFixed(4)}
                        onValueChange={(value) =>
                          setQuestion((prev) =>
                            prev
                              ? { ...prev, difficulty: Number.parseFloat(value) }
                              : prev,
                          )
                        }
                      >
                        <SelectTrigger id="difficulty" className="w-1/4 min-w-36">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "-3.0000",
                            "-2.0000",
                            "-1.0000",
                            "0.0000",
                            "1.0000",
                            "2.0000",
                            "3.0000",
                          ].map((difficultyValue) => (
                            <SelectItem
                              key={difficultyValue}
                              value={difficultyValue}
                            >
                              {difficultyValue}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id="difficulty"
                        className="w-1/4"
                        value={Number(question?.difficulty ?? 0).toFixed(4)}
                        disabled
                        readOnly
                      />
                    )}
                    <p className="text-xs text-muted-foreground">
                      Difficulty range is from -3.0000 to 3.0000.
                    </p>
                  </div>
                );
              }
            })()}

            {/* Unit */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="unit"
                className="text-md font-semibold text-foreground"
              >
                Unit
              </Label>
              <Select
                value={selectedUnitPublicId || question?.unit || ""}
                onValueChange={(val) => {
                  if (onUnitChange) {
                    onUnitChange(val);
                    return;
                  }
                  setQuestion((prev) => (prev ? { ...prev, unit: val } : prev));
                }}
              >
                <SelectTrigger id="unit">
                  <SelectValue placeholder="Select a unit" />
                </SelectTrigger>
                <SelectContent>
                  {availableUnits.length > 0 ? (
                    availableUnits.map((unit) => (
                      <SelectItem key={unit.public_id} value={unit.public_id}>
                        {`Unit ${unit.number}: ${unit.name}`}
                      </SelectItem>
                    ))
                  ) : (
                    <>
                      <SelectItem value="unit-1">Unit 1</SelectItem>
                      <SelectItem value="unit-2">Unit 2</SelectItem>
                      <SelectItem value="unit-3">Unit 3</SelectItem>
                    </>
                  )}
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
                value={selectedSubtopicPublicId || question?.subtopic_name || ""}
                onValueChange={(val) => {
                  if (onSubtopicChange) {
                    onSubtopicChange(val);
                    return;
                  }
                  setQuestion((prev) =>
                    prev ? { ...prev, subtopic: val } : prev,
                  );
                }}
              >
                <SelectTrigger id="subtopic">
                  <SelectValue placeholder="Select a subtopic" />
                </SelectTrigger>
                <SelectContent>
                  {availableSubtopics.length > 0 ? (
                    availableSubtopics.map((subtopic) => (
                      <SelectItem
                        key={subtopic.public_id}
                        value={subtopic.public_id}
                      >
                        {subtopic.name}
                      </SelectItem>
                    ))
                  ) : (
                    <>
                      <SelectItem value="subtopic-1">Subtopic 1</SelectItem>
                      <SelectItem value="subtopic-2">Subtopic 2</SelectItem>
                      <SelectItem value="subtopic-3">Subtopic 3</SelectItem>
                    </>
                  )}
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
