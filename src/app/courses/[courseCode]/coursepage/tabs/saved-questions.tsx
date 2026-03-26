import SavedQuestionItem from "@/components/macfast/saved-questions-item/saved-questions-item";
import SavedQuestionItemSkeleton from "@/components/macfast/saved-questions-item/saved-questions-skeleton";
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
      <div className="flex flex-col gap-4">
        <div className="mb-2">
          <h2 className="text-lg font-semibold text-foreground">
            Saved Questions
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage the questions you've saved for review.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {isLoading ? (
            <>
              {Array.from({ length: 5 }, (_, i) => (
                <SavedQuestionItemSkeleton key={i} />
              ))}
            </>
          ) : (
            <>
              {savedForLaters?.length !== 0 &&
                savedForLaters?.map((savedForLater) => (
                  <SavedQuestionItem
                    key={savedForLater.question.public_id}
                    question={savedForLater.question}
                    onRemove={() => {
                      setSavedForLaters(
                        savedForLaters.filter(
                          (s) =>
                            s.question.public_id !==
                            savedForLater.question.public_id,
                        ),
                        { revalidate: false },
                      );
                    }}
                  />
                ))}
            </>
          )}
        </div>
        {savedForLaters?.length === 0 && (
          <div className="rounded-lg border border-dashed border-light-gray p-10 text-center text-muted-foreground">
            When you save questions, they'll appear here.
          </div>
        )}
      </div>
    </TabsContent>
  );
}
