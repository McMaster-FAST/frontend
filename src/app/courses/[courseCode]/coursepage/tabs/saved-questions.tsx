import SavedQuestionItem from "@/components/ui/custom/saved-question-item";
import { TabsContent } from "@/components/ui/tabs";
import { useSavedForLaters } from "@/hooks/useSavedForLaters";

interface SavedQuestionsTabProps {
  courseCode: string;
}

export default function SavedQuestionsTab({
  courseCode,
}: SavedQuestionsTabProps) {
  const { savedForLaters, isLoading, error, setSavedForLaters } =
    useSavedForLaters(courseCode);

  return (
    <TabsContent
      value="savedQuestions"
      className="mt-0 flex-1 overflow-y-auto min-h-0 pr-2"
    >
      {/* TODO Skeleton loading */}
      <div className="flex flex-col gap-2 mb-4">
        {savedForLaters?.length !== 0 &&
          savedForLaters?.map((savedForLater) => (
            <SavedQuestionItem
              key={savedForLater.question.public_id}
              question={savedForLater.question}
            />
          ))}
      </div>
      {savedForLaters?.length === 0 && (
        <div className="rounded-lg border border-dashed border-light-gray p-10 text-center text-dark-gray">
          When you save questions, they'll appear here.
        </div>
      )}
    </TabsContent>
  );
}
