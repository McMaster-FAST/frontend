import AbilityLevel from "@/types/AbilityLevel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

interface UnitsAccordionProps {
  units?: Unit[];
}

function getAbilityTermFromScore(score?: number): AbilityLevel {
    if (!score || score < -1 || score > 1) {
        console.error("Ability score must be between -1 and 1");
        return AbilityLevel.NOT_APPLICABLE;
    }
    if (score < -0.75) return AbilityLevel.POOR;
    if (score < -0.1) return AbilityLevel.DEVELOPING;
    if (score < 0.1) return AbilityLevel.AVERAGE;
    if (score < 0.75) return AbilityLevel.PROFICIENT;
    return AbilityLevel.EXEMPLARY;
}

function UnitsAccordion({ units }: UnitsAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {units?.map((unit, index) => (
        <AccordionItem value={`unit-${index}`} key={index}>
          <AccordionTrigger>
            <div className="w-full">
            {`Unit ${unit.number}: ${unit.name}`}
            <Progress className="max-w-3/4" value={((unit.unitAbilityScore ?? 0) + 1) * 50} caption={getAbilityTermFromScore(unit.unitAbilityScore)} />
            </div>
          </AccordionTrigger>
          
          <AccordionContent>
            {unit.subtopics?.map((subtopic, subIndex) => (
              <div className="ml-2 whitespace-nowrap flex flex-row items-center font-poppins font-medium justify-between">
                <div className="w-full flex-2">
                  <p key={subIndex}>{subtopic.name}</p>
                  <Progress value={50} caption={getAbilityTermFromScore(subtopic.abilityScore)} />
                </div>
                <span
                  className={`flex flex-1 text-lg justify-center ${
                    subtopic.attempted ? "text-dark-gray" : "text-primary"
                  }`}
                >
                  {subtopic.attempted ? "Attempted" : "Unattempted"}
                </span>
                <div className="flex-0 flex justify-end">
                  <Button variant="secondary">Practice</Button>
                </div>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default UnitsAccordion;
