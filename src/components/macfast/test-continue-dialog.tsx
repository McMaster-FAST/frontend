"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ContinueAction } from "@/types/actions/ContinueAction";
import ActionInfo from "@/types/actions/ContinueActionInfo";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
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
  const isEndOfTest = actions?.some(
    (action) =>
      action.type === ContinueAction.USE_SKIPPED_QUESTIONS ||
      action.type === ContinueAction.REPEAT_QUESTIONS ||
      action.type === ContinueAction.RESTART_SESSION,
  );

  return (
    <AlertDialog {...props}>
      <AlertDialogContent>
        {isEndOfTest ? (
          <>
            <AlertDialogTitle>End of Test</AlertDialogTitle>
            <AlertDialogDescription>
              There are no appropriate questions.
            </AlertDialogDescription>
          </>
        ) : (
          <VisuallyHidden.Root>
            <AlertDialogTitle>Continue Test</AlertDialogTitle>
          </VisuallyHidden.Root>
        )}
   
        {notes &&
          notes.map((note, index) => (
            <AlertDialogDescription key={index}>{note}</AlertDialogDescription>
          ))}
        <AlertDialogDescription>Choose how to proceed:</AlertDialogDescription>
        {actions?.map((action, index) => (
          <AlertDialogAction
            key={index}
            onClick={async () => {
              // Actions might not be async, but if they are we need to wait for them
              await action.action();
              router.refresh();
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
