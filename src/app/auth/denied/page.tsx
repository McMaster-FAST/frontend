import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function DeniedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 text-center">
      <h1 className="text-4xl font-bold text-primary">403 - Access Denied</h1>
      <p className="text-lg text-dark-gray">
        You do not have the required permissions to view this page.
      </p>

      <Link href="/" className={buttonVariants({ variant: "primary" })}>
        Return Home
      </Link>
    </div>
  );
}
