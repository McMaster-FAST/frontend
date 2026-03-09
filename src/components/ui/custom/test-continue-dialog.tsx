"use client";

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
import { useEffect, useState } from "react";

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
          There are no appropriate questions. You may see this message multiple
          times.
        </AlertDialogDescription>
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
