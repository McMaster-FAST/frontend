import { Questions } from "@/app/courses/[courseCode]/dashboard/tabs/questions-tab";
import { MacFastHeader } from "@/components/ui/custom/macfast-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UnitsAccordion from "@/components/ui/custom/unit-accordion";

const unit: Unit[] = [
    {
        name: "Acid/Base Equilibria",
        number: "1",
        unitAbilityScore: 0.72,
        subtopics: [
            {   attempted: true,
                name: "Acid & Base",
                abilityScore: 0.48,
                description: ["Introduction to acids and bases", "Properties of acids and bases", "pH and pOH calculations"],
                studyAids: ["https://www.macvideo.ca/media/1Aa3-Problem%20Solving%20-%20Acid-Baseq1%20Fixed.mp4/1_914hkq45", "https://www.macvideo.ca/media/1AA3-Problem+Solving+-+Acid-BaseQ2/1_5as7lmiq"]
            },
            {   attempted: false,
                name: "Buffers",
                abilityScore: 0.0,
                description: ["Understanding buffer solutions", "Calculating buffer capacity", "Applications of buffers in biological systems"]
            }
        ]
    },
    {
        name: "Kinetics",
        number: "2",
        unitAbilityScore: 0.32,
        subtopics: []
    },
    {
        name: "Intermolecular Forces",
        number: "3",
        unitAbilityScore: 0.85,
        subtopics: []
    },
    {
        name: "Organic Chemistry: Structure and Bonding",
        number: "4a",
        unitAbilityScore: 0,
        subtopics: []
    },
    {
        name: "Organic Chemistry: Reactivity",
        number: "4b",
        unitAbilityScore: 0,
        subtopics: []
    },
    {
        name: "Chembio",
        number: "5",
        unitAbilityScore: 0.15,
        subtopics: []
    }
]


function LearningObjectivePage() {
    return (
        <>
        <MacFastHeader />
        <h2 className="text-2xl font-bold text-foreground m-5">Hello, Peter</h2>
        <main className="flex-1 m-5">
            <Tabs className="w-full" defaultValue="learningObjectives">
                <TabsList className="w-full">
                    <TabsTrigger value="practiceProblems">Practice Problems</TabsTrigger>
                    <TabsTrigger value="learningObjectives">Learning Objectives</TabsTrigger>
                    <TabsTrigger value="statistics">Statistics</TabsTrigger>
                    <TabsTrigger value="savedQuestions">Saved Questions</TabsTrigger>
                </TabsList>
                <TabsContent value="practiceProblems">
                    <div>{unit.map((unit, index) => (
                    <UnitsAccordion key={index} units={[unit]} />
                    ))}
                    </div>
                </TabsContent>
                <TabsContent value="learningObjectives">
                    <div>{unit.map((unit, index) => (
                    <UnitsAccordion key={index} units={[unit]} tab="learningObjectives" />
                    ))}
                    </div>
                </TabsContent>
            </Tabs>
        </main>
        </>
        
    );
}



export default LearningObjectivePage;