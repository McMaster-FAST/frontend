import { setSavedForLaterDebounced } from "@/lib/api";
import { Checkbox } from "../checkbox";
import { Label } from "../label";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";
import { useEffect, useState } from "react";
import { Alert } from "../alert";
import { set } from "lodash";

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

  const handleSaveForLater = (checked: boolean) => {
    if (!courseCode || !question?.public_id) {
      setSaved(!checked);
      return;
    }
    setSavedForLaterDebounced(
      courseCode,
      question.public_id,
      checked,
      authFetch,
    );
  };

  useEffect(() => {
    if (!question) return;
    setSaved(question.saved_for_later);
  }, [question]);

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
