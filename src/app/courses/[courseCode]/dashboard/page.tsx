import { Questions } from "@/app/courses/[courseCode]/dashboard/tabs/questions-tab";
import { MacFastHeader } from "@/components/ui/custom/macfast-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function InstructorDashboardPage() {
    return (
        <>
        <MacFastHeader userId="wardelp" userCourses={[{ code: "MATH101", name: "Calculus I", year: 2025, semester: 1}]} />
        <h2 className="text-2xl font-bold text-foreground m-5">Hello, Peter</h2>
        <main className="flex-1 m-5">
            <Tabs className="w-full" defaultValue="questions">
                <TabsList className="w-full">
                    <TabsTrigger value="questions">Questions</TabsTrigger>
                    <TabsTrigger value="classList">Class List</TabsTrigger>
                </TabsList>
                <TabsContent value="questions">
                    <Questions />
                </TabsContent>
                <TabsContent value="classList">
                    <div>Class List Content</div>
                </TabsContent>
            </Tabs>
        </main>
        </>
        
    );
}

export default InstructorDashboardPage;