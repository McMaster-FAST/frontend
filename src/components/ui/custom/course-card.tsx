"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type CourseCardProps = {
  course: Course;
  progress: number;
};

function CourseCard({ course, progress }: CourseCardProps) {
  const router = useRouter();
  const [resumeNotice, setResumeNotice] = useState<string | null>(null);
  const onResume = () => {
    const target = course.resume_target;
    if (!target) {
      throw new Error("No resume target available for this course.");
    }

    const courseCode = target.course_code?.trim();
    const unitName = target.unit_name?.trim();
    const subtopicName = target.subtopic_name?.trim();
    if (!courseCode || !unitName || !subtopicName) {
      setResumeNotice(
        "Resume data from the server was incomplete. Please open the course and pick a subtopic.",
      );
      return;
    }
    const url = `/courses/${encodeURIComponent(courseCode)}/${encodeURIComponent(unitName)}/${encodeURIComponent(subtopicName)}/test`;
    router.push(url);
  };

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
          <Link href={`/courses/${course.code}/coursepage`}>{course.name}</Link>
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

      <CardFooter className="flex flex-col gap-2 border-t border-dark-gray-50 bg-dark-gray-50/50 p-4">
        {onResume && course.resume_target && (
          <Button
            className="gap-2 text-xs shadow-sm font-bold w-full"
            onClick={onResume}
          >
            <div>
              <div>Resume</div>
              <div>{`(${course.resume_target.subtopic_name})`}</div>
            </div>
          </Button>
        )}
        <Button variant="secondary" className="text-xs font-bold w-full">
          <Link href={`/courses/${course.code}/coursepage`}>Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CourseCard;
