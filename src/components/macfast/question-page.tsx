import ErrorMessage from "@/components/macfast/error-message";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
interface QuestionPageProps {
  children: React.ReactNode;
  onReturn?: () => void;
}

function QuestionPage({ children, onReturn }: QuestionPageProps) {
  const router = useRouter();
  let header, content, footer, title;
  for (const child of React.Children.toArray(children)) {
    if (!React.isValidElement(child)) continue;
    const type = child.type as any;
    if (type === Header) {
      header = child;
    } else if (type === Title) {
      title = child;
    } else if (type === Content) {
      content = child;
    } else if (type === Actions) {
      footer = child;
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {header}
      <div>
        <Button
          className="gap-2"
          variant="tertiary"
          onClick={onReturn ? onReturn : () => router.back()}
        >
          <ArrowLeft/>
          Back to Course Page
        </Button>
      </div>
      <div className="flex flex-col gap-4 p-8 flex-1">
        {title}
        {content}
      </div>
      {footer}
    </div>
  );
}

function Header({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row font-poppins font-semibold text-xl items-center gap-2 text-foreground">
      {children}
    </div>
  );
}

function QuestionBody({
  children,
  error,
  isLoading,
}: {
  children: React.ReactNode;
  error: string;
  isLoading?: boolean;
}) {
  return (
    <div className="flex-2 flex flex-col gap-6">
      {error && <ErrorMessage message={error} />}
      {isLoading ? <Skeleton className="w-full h-40" /> : children}
    </div>
  );
}

function Actions({ children }: { children: React.ReactNode }) {
  return (
    <footer className="flex flex-row gap-4 sticky bottom-0 left-0 w-full p-4 border-t-2 bg-background">
      {children}
    </footer>
  );
}

function Options({
  children,
  isLoading,
}: {
  children: React.ReactNode;
  isLoading: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      {isLoading
        ? Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-10" />
          ))
        : children}
    </div>
  );
}

function Answer({
  children,
  isLoading,
  isAnswered,
}: {
  children: React.ReactNode;
  isLoading: boolean;
  isAnswered: boolean;
}) {
  let placeholder, others;
  for (const child of React.Children.toArray(children)) {
    if (!React.isValidElement(child)) continue;
    const type = child.type as any;
    if (type === AnswerPlaceholder) {
      placeholder = child;
    } else {
      others = others ? [...others, child] : [child];
    }
  }
  return (
    <div className="border-t-2 pt-4 md:border-t-0 md:border-l-2 md:pt-0 border-gray-300 md:pl-4 flex-1 flex flex-col gap-4">
      {!isLoading && isAnswered && others}
      {!isLoading && !isAnswered && placeholder}
      {isLoading && <Skeleton className="w-full h-40" />}
    </div>
  );
}

function AnswerTitle({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1 className="font-poppins font-bold text-2xl">
        The correct answer is:
      </h1>
      {children}
    </div>
  );
}

function AnswerBody({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-poppins font-semibold text-lg">Why?</h2>
      {children}
    </div>
  );
}

function AnswerPlaceholder({ children }: { children: React.ReactNode }) {
  return children;
}

function Content({ children }: { children: React.ReactNode }) {
  return (
    <div id="content" className="flex flex-col md:flex-row gap-4 flex-1">
      {children}
    </div>
  );
}

QuestionPage.Header = Header;
QuestionPage.Title = Title;
QuestionPage.QuestionBody = QuestionBody;
QuestionPage.Content = Content;
QuestionPage.Actions = Actions;
QuestionPage.Options = Options;
QuestionPage.Answer = Answer;
QuestionPage.AnswerTitle = AnswerTitle;
QuestionPage.AnswerBody = AnswerBody;
QuestionPage.AnswerPlaceholder = AnswerPlaceholder;

export { QuestionPage };
