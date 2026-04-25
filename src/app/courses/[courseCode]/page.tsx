import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ courseCode: string }>;
};

export default async function CourseRootPage({ params }: Props) {
  const { courseCode } = await params;
  redirect(`/courses/${courseCode}/coursepage`);
}
