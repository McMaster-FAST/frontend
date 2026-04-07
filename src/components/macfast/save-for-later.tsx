import { setSavedForLater } from "@/lib/question-api";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";
import { useEffect, useState } from "react";
import { debounce } from "lodash";

interface SaveForLaterProps {
  courseCode: string | null;
  question: TestQuestion | null;
  error: string;
}

export default function SaveForLater({
  courseCode,
  question,
  error,
}: SaveForLaterProps) {
  const authFetch = useAuthFetch();
  const [isSaved, setSaved] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const disabled = !!error || !courseCode || !question;

  const handleSaveForLater = async (checked: boolean) => {
    if (!courseCode || !question?.public_id) {
      return;
    }

    const setSavedForLaterWithLoading = () => {
      setSaved(checked);
      setIsActionLoading(true);
      setSavedForLater(courseCode, question.public_id, checked, authFetch)
        .catch(() => {
          setSaved(!checked);
        })
        .finally(() => setIsActionLoading(false));
    };

    debounce(setSavedForLaterWithLoading, 300)();
  };

  useEffect(() => {
    if (!question) return;
    setSaved(question.saved_for_later);
  }, [question?.public_id]);

  return (
    <div className="inline-flex gap-2">
      <Checkbox
        id="save-for-later"
        disabled={disabled}
        checked={isSaved}
        onCheckedChange={handleSaveForLater}
        isActionLoading={isActionLoading}
      />
      <Label htmlFor="save-for-later">Save for Later</Label>
    </div>
  );
}
