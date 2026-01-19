import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type CourseCardProps = {
  course: Course;
  progress: number;
  onResume?: () => void;
};

function CourseCard({ course, progress, onResume }: CourseCardProps) {
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
        <Button variant="primary" rightIcon={ArrowRight} onClick={onResume}>
          Resume
        </Button>
      </CardFooter>
    </Card>
  );
}
export default CourseCard;
