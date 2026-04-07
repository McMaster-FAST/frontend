import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  title?: string;
  message?: string;
}
function ErrorMessage({ title, message, ...props }: ErrorMessageProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Alert variant="destructive" {...props}>
      <AlertCircle className="h-4 w-4" />
      {title && <AlertTitle>{title}</AlertTitle>}
      {message && <AlertDescription>{message}</AlertDescription>}
    </Alert>
  );
}

export default ErrorMessage;
