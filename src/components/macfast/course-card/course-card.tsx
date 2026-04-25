"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { CompletionBar } from "@/components/macfast/completion-bar/completion-bar";
import { BookOpen, Calendar, Play, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

type CourseCardProps = {
  course: Course;
  progress: number;
};

function CourseCard({ course, progress }: CourseCardProps) {
  const router = useRouter();
  const target = course.resume_target;
  const hasFullResumeTarget =
    target && target.course_code && target.unit_name && target.subtopic_name;

  // TODO: remove once endpoint to update course info is ready
    const courseName = (course.name ?? "").toLowerCase();
  let bannerImageSrc = "/images/chemistry.jpg";
  if (courseName.includes("natural") && courseName.includes("disaster")) {
    bannerImageSrc = "/images/natural%20disasters.jpg";
  } else if (courseName.includes("debug")) {
    bannerImageSrc = "/images/debug.jpg";
  } else if (courseName.includes("chemistry")) {
    bannerImageSrc = "/images/chemistry.jpg";
  }

  const onResume = () => {
    if (!target) {
      throw new Error("No resume target available for this course.");
    }

    const courseCode = target.course_code?.trim();
    const unitName = target.unit_name?.trim();
    const subtopicName = target.subtopic_name?.trim();

    const url = `/courses/${encodeURIComponent(courseCode)}/${encodeURIComponent(unitName)}/${encodeURIComponent(subtopicName)}/test`;
    router.push(url);
  };

  return (
    <Card className="group relative flex w-full flex-col overflow-hidden border-light-gray dark:border-dark-gray bg-card transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-40 overflow-hidden">
        <Image
          src={bannerImageSrc} // TODO: to be changed once endpoint to update course info is ready
          alt={`${course.name} banner`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105 opacity-95 brightness-110 saturate-110"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-light-gray/45 to-dark-gray/45 transition-colors group-hover:from-text-gold/25 group-hover:to-text-maroon/25" />

        <div className="relative z-10 flex h-full justify-between items-start p-4">
          <Badge
            variant="secondary"
            className="bg-background font-poppins text-sm font-extrabold text-foreground backdrop-blur-sm"
          >
            {course.code}
          </Badge>
          <div className="flex items-center gap-1 text-sm uppercase font-bold tracking-wider text-white">
            <Calendar className="h-3 w-3" />
            <span>{course.year}</span>
          </div>
        </div>
      </div>

      <CardHeader className="pb-2 pt-4">
        <h3 className="line-clamp-2 min-h-[3.5rem] font-poppins text-lg font-bold leading-tight text-foreground group-hover:text-primary-hover">
          <Link href={`/courses/${course.code}/coursepage`}>{course.name}</Link>
        </h3>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="flex items-center gap-2 text-sm font-medium text-secondary-foreground">
          <BookOpen className="h-4 w-4" />
          <span>{course.semester}</span>
        </div>

        <p className="line-clamp-3 text-sm font-medium leading-relaxed text-muted-foreground">
          {course.description}
        </p>

        <div className="mt-auto space-y-2 pt-2">
          <CompletionBar correct={progress} total={100} className="h-2" />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 border-t border-dark-gray-50 bg-dark-gray-50/50 p-4">
        {onResume && hasFullResumeTarget && (
          <Button className="font-bold gap-2 w-full" onClick={onResume}>
            <div className="flex min-w-0 items-center gap-1 text-left">
              <span className="shrink-0">Resume</span>
              <span className="truncate" title={target.subtopic_name}>
                {`(${target.subtopic_name})`}
              </span>
            </div>
          </Button>
        )}
        <Button
          variant="secondary"
          className="font-bold w-full"
          asChild
        >
          <Link href={`/courses/${course.code}/coursepage`}>
            <span>Details</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CourseCard;
