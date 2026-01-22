import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Video } from "lucide-react";
import Link from "next/link";

function getAbilityTermFromScore(score?: number) {
  if (score === undefined) return "Not Attempted";
  if ((!score && score !== 0) || score < -1 || score > 1) {
    console.error("Ability score must be between -1 and 1, you passed:", score);
    return "Something went wrong";
  }
  if (score < -0.75) return "Poor";
  if (score < -0.1) return "Developing";
  if (score < 0.1) return "Average";
  if (score < 0.75) return "Proficient";
  return "Exemplary";
}

interface UnitsAccordionProps {
  units?: Unit[];
  tab?: string;
  course: { code: string };
  value: string;
  setValue: (value: string) => void;
}

function UnitsAccordion({
  units,
  tab,
  course,
  value,
  setValue,
}: UnitsAccordionProps) {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      value={value}
      onValueChange={setValue}
    >
      {units?.map((unit, index) => (
        <AccordionItem value={`unit-${index}`} key={index}>
          <AccordionTrigger className="flex justify-between items-center gap-4 py-2">
            <div className="w-full">
              {`Unit ${unit.number}: ${unit.name}`}
              <Progress
                className="max-w-3/4"
                value={unit.unitAbilityScore}
                caption={getAbilityTermFromScore(unit.unitAbilityScore)}
              />
            </div>
            {/* Have to use a span tag since a button inside a button violates HTMLs rules */}
            <span className={buttonVariants({ variant: "primary" })}>
              Subtopics
            </span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            {unit.subtopics?.map((subtopic, subIndex) => (
              <div key={subIndex} className="w-full">
                <div className="ml-2 whitespace-nowrap flex flex-row items-center font-poppins font-medium justify-between">
                  <div className="w-full flex-2">
                    <p>{subtopic.name}</p>
                    {tab === "practiceProblems" && (
                      <Progress
                        value={subtopic.abilityScore}
                        caption={getAbilityTermFromScore(subtopic.abilityScore)}
                      />
                    )}
                  </div>
                  {tab === "practiceProblems" && (
                    <>
                      <span
                        className={`flex flex-1 text-sm justify-center ${
                          subtopic.attempted ? "text-dark-gray" : "text-primary"
                        }`}
                      >
                        {subtopic.attempted ? "Attempted" : "Unattempted"}
                      </span>
                      <div className="flex-0 flex justify-end">
                        <Button variant="secondary" className="text-sm">
                          <Link
                            href={`/courses/${course.code}/${unit.name}/${subtopic.name}/test`}
                          >
                            Practice
                          </Link>
                        </Button>
                      </div>
                    </>
                  )}
                </div>
                {tab === "learningObjectives" &&
                  subtopic.description &&
                  subtopic.description.length > 0 && (
                    <p className="mt-2 ml-6 leading-tight text-sm text-dark-gray font-medium">
                      {subtopic.description}
                    </p>
                  )}

                {tab === "learningObjectives" &&
                  subtopic.study_aids &&
                  subtopic.study_aids.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 ml-6">
                      {subtopic.study_aids.map((aid) => (
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
      ))}
    </Accordion>
  );
}

export default UnitsAccordion;
