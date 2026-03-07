import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface WarningMessageProps {
  title?: string;
  message?: string;
}
function WarningMessage({ title, message }: WarningMessageProps) {
  return (
    <Alert variant="warning">
      <AlertTriangle className="h-4 w-4" />
      {title && <AlertTitle>{title}</AlertTitle>}
      {message && <AlertDescription>{message}</AlertDescription>}
    </Alert>
  );
}

export default WarningMessage;
