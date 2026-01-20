import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, BookOpen, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export type Course = {
  code: string;
  name: string;
  year: number;
  semester: string;
  description: string;
  units: any[];
};

type CourseCardProps = {
  course: Course;
  progress: number;
};

function CourseCard({ course, progress }: CourseCardProps) {
  return (
    <Card className="group relative flex w-full flex-col overflow-hidden border-light-gray bg-white transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="h-40 bg-gradient-to-br from-slate-50 to-slate-200 p-4 transition-colors group-hover:from-text-gold group-hover:to-text-maroon">
        <div className="flex justify-between items-start">
          <Badge
            variant="secondary"
            className="bg-white/80 font-poppins text-sm font-extrabold text-dark-gray backdrop-blur-sm"
          >
            {course.code}
          </Badge>
          <div className="flex items-center gap-1 text-sm uppercase font-bold tracking-wider text-dark-gray">
            <Calendar className="h-3 w-3" />
            <span>{course.year}</span>
          </div>
        </div>
      </div>

      <CardHeader className="pb-2 pt-4">
        <h3 className="line-clamp-2 min-h-[3.5rem] font-poppins text-lg font-bold leading-tight text-primary group-hover:text-primary-hover">
          <Link href={`/courses/${course.code}/coursePage`}>{course.name}</Link>
        </h3>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="flex items-center gap-2 text-sm font-medium text-secondary-foreground">
          <BookOpen className="h-4 w-4" />
          <span>{course.semester}</span>
        </div>

        <p className="line-clamp-3 text-sm leading-relaxed text-dark-gray">
          {course.description}
        </p>

        <div className="mt-auto space-y-2 pt-2">
          <div className="flex justify-between text-xs font-medium text-dark-gray">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 border-t border-dark-gray-50 bg-dark-gray-50/50 p-4">
        <Button variant="secondary" className="flex-1 text-xs font-bold">
          <Link href={`/courses/${course.code}/coursePage`}>Details</Link>
        </Button>
        <Button className="flex-1 gap-2 text-xs shadow-sm font-bold">
          Resume <ArrowRight className="h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CourseCard;
