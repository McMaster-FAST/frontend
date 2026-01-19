import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Video } from 'lucide-react';

function getAbilityTermFromScore(score?: number) {
  if ((!score && score !== 0) || score < -1 || score > 1) {
    console.error("Ability score must be between -1 and 1");
    return "Not Applicable";
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
}

function UnitsAccordion({ units, tab }: UnitsAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {units?.map((unit, index) => (

        <AccordionItem value={`unit-${index}`} key={index}>

          <AccordionTrigger hideChevron className="flex justify-between items-center gap-4">
            <div className="w-full">
              {`Unit ${unit.number}: ${unit.name}`}
              <Progress
                className="max-w-3/4"
                value={((unit.unitAbilityScore ?? 0) + 1) * 50}
                caption={getAbilityTermFromScore(unit.unitAbilityScore)}
              />
            </div>
            <p className={buttonVariants({variant: "primary"})}>Sections</p>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            {unit.subtopics?.map((subtopic, subIndex) => (
              <div key={subIndex} className="w-full">
                <div className="ml-2 whitespace-nowrap flex flex-row items-center font-poppins font-medium justify-between">
                  <div className="w-full flex-2">
                    <p>{subtopic.name}</p>
                    <Progress value={50} caption={getAbilityTermFromScore(subtopic.abilityScore)} />
                  </div>
                  <span
                    className={`flex flex-1 text-lg justify-center ${subtopic.attempted ? "text-dark-gray" : "text-primary"
                      }`}
                  >
                    {subtopic.attempted ? "Attempted" : "Unattempted"}
                  </span>
                  <div className="flex-0 flex justify-end">
                    <Button variant="secondary">Practice</Button>
                  </div>
                </div>
                {tab === "learningObjectives" && subtopic.description && subtopic.description.length > 0 && (
                  <ul className="list-disc ml-12">
                    {subtopic.description.map((point, i) => (
                      <li key={i} className="leading-tight">{point}</li>
                    ))}
                  </ul>
                )}

                {tab === "learningObjectives" && subtopic.studyAids && subtopic.studyAids.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {subtopic.studyAids.map((url, i) => (
                      <a
                        key={url ?? `${subtopic.name}-video-${i}`}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Watch video for ${subtopic.name}`}
                        className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-muted/50 text-sm text-muted-foreground hover:bg-muted"
                      >
                        <Video className="w-4 h-4" />
                        <span>Watch on MacVideo</span>
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
