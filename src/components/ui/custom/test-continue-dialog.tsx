import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ActionInfo from "@/types/actions/ContinueActionInfo";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { useRouter } from "next/navigation";
import { JSX } from "react/jsx-runtime";

interface TestContinueDialogProps extends React.ComponentProps<
  typeof AlertDialogPrimitive.Root
> {
  actions?: ActionInfo[];
  notes?: JSX.Element[];
}

export default function TestContinueDialog({
  actions,
  notes,
  ...props
}: TestContinueDialogProps) {
  const router = useRouter();
  return (
    <AlertDialog {...props}>
      <AlertDialogContent>
        <AlertDialogTitle>End of Test</AlertDialogTitle>
        <AlertDialogDescription>
          There are no appropriate questions.
        </AlertDialogDescription>
        {notes && notes.map((note, index) => (
          <AlertDialogDescription key={index}>
            {note}
          </AlertDialogDescription>
        ))}
        <AlertDialogDescription>Choose how to proceed:</AlertDialogDescription>
        {actions?.map((action, index) => (
          <AlertDialogAction
            key={index}
            onClick={() => {
              action.action();
              window.location.reload();
            }}
          >
            {action.caption}
          </AlertDialogAction>
        ))}
        <AlertDialogCancel
          onClick={() => {
            router.push("../../coursepage");
          }}
        >
          Return to course page
        </AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>
  );
}
