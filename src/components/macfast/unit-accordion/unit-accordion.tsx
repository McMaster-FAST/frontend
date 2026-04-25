import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import { Video } from "lucide-react";
import Link from "next/link";
import { AbilityScoreBar } from "../ability-score-bar/ability-score-bar";
import { CompletionBar } from "../completion-bar/completion-bar";

interface UnitsAccordionProps {
  tab?: string;
  course: Course;
  value: string;
  setValue: (value: string) => void;
}

function UnitsAccordion({ tab, course, value, setValue }: UnitsAccordionProps) {
  const getEncodedTestURI = (
    courseCode: string,
    unitName: string,
    subtopicName: string,
  ) => {
    const encodedCourseCode = encodeURIComponent(courseCode);
    const encodedUnitName = encodeURIComponent(unitName);
    const encodedSubtopicName = encodeURIComponent(subtopicName);
    return `/courses/${encodedCourseCode}/${encodedUnitName}/${encodedSubtopicName}/test`;
  };
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      value={value}
      onValueChange={setValue}
    >
      {course.units?.map((unit, index) => {
        const totalSubtopics = unit.subtopics?.length || 0;
        const attemptedCount =
          unit.subtopics?.filter((sub) => sub.user_ability !== null).length ||
          0;

        // TODO replace with actual XP from backend (no endpoint rn)
        const rawTotalXp = 780;

        // TOODO: replace with actual completion percentage from backend (no endpoint rn)
        const correctQuestions = 840;
        const totalQuestions = 2000;

        return (
          <AccordionItem value={`unit-${index}`} key={index}>
            <AccordionTrigger className="flex justify-between items-center py-2 hover:no-underline w-full">
              <div className="text-left flex-1 pr-8 flex flex-col justify-center w-full md:w-4/5">
                <div className="font-medium truncate text-md">
                  {`Unit ${unit.number}: ${unit.name}`}
                </div>
                {tab === "practiceProblems" && (
                  <div className="flex flex-row items-center w-1/2 gap-6 mt-1">
                    <div className="flex-1">
                      <CompletionBar
                        correct={correctQuestions}
                        total={totalQuestions}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                {tab === "practiceProblems" && (
                  <span
                    className={`text-sm font-normal text-foreground hidden sm:inline-block ${
                      attemptedCount > 0
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {attemptedCount > 0
                      ? `${attemptedCount}/${totalSubtopics} attempted`
                      : "Unattempted"}
                  </span>
                )}

                <span className={buttonVariants({ variant: "primary" })}>
                  Subtopics
                </span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="flex flex-col gap-4">
              {unit.subtopics?.map((subtopic, subIndex) => (
                <div key={subIndex} className="w-full">
                  {/*
                    Hide navigation for subtopics without active questions so users
                    don't enter an empty practice flow.
                  */}
                  {(() => {
                    const hasQuestions = (subtopic.question_count ?? 0) > 0;
                    return (
                  <div className="ml-2 whitespace-nowrap flex flex-row items-center font-poppins font-medium justify-between">
                    <div className="w-full flex-2">
                      <p>{subtopic.name}</p>
                      {tab === "practiceProblems" && (
                        <div className="mt-1 w-full max-w-sm">
                          <AbilityScoreBar
                            ability_score={subtopic.user_ability}
                          />
                        </div>
                      )}
                    </div>
                    {tab === "practiceProblems" && (
                      <>
                        <span
                          className={`flex flex-1 text-sm justify-center ${
                            subtopic.user_ability?.mastery_value
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {subtopic.user_ability?.mastery_value
                            ? "Attempted"
                            : "Unattempted"}
                        </span>
                        <div className="flex-0 flex justify-end">
                          {hasQuestions ? (
                            <Button variant="secondary" className="text-sm" asChild>
                              <Link
                                href={getEncodedTestURI(
                                  course.code,
                                  unit.name,
                                  subtopic.name,
                                )}
                              >
                                Practice
                              </Link>
                            </Button>
                          ) : (
                            <Button
                              variant="secondary"
                              className="text-sm"
                              disabled
                              aria-disabled
                            >
                              No questions
                            </Button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                    );
                  })()}
                  {tab === "learningObjectives" &&
                    subtopic.description &&
                    subtopic.description.length > 0 && (
                      <p className="mt-2 ml-6 leading-tight text-sm text-muted-foreground font-medium">
                        {subtopic.description}
                      </p>
                    )}

                  {tab === "learningObjectives" &&
                    subtopic.study_aids &&
                    subtopic.study_aids.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2 ml-6">
                        {subtopic.study_aids.map((aid: any) => (
                          <a
                            key={aid.id}
                            href={aid.reference}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Watch video: ${aid.name}`}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-light-gray bg-white text-xs font-medium text-dark-gray hover:bg-off-white transition-colors"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>{aid.name || "Watch on MacVideo"}</span>
                          </a>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

export default UnitsAccordion;
