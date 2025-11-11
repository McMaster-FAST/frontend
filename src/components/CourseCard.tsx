import { Card, CardAction, CardContent, CardFooter, CardHeader } from "./ui/card";
import Course from "@/types/Course";
import { Progress } from "./ui/progress";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

type CourseCardProps = {
    course: Course;
    progress: number;
}

function CourseCard({course, progress}: CourseCardProps) {
    return (
        <Card className="min-w-[345px]">
            <CardHeader>{course.code}</CardHeader>
            <CardContent>{course.name}</CardContent>
            <CardContent className="flex flex-col">
                <Progress className="max-w-3/4" value={progress} />
                <p>{progress}/100</p>
            </CardContent>
            <CardFooter className="gap-2">
                <Button variant="secondary">Course Page</Button>
                <Button variant="primary" rightIcon={ArrowRight}>Resume</Button>
            </CardFooter>
        </Card>
    );
}
export default CourseCard;