"use client";

import Image from "next/image";
import {useState} from "react";
import {ping} from "@/lib/api";

export default function Home() {
  const [pingResult, setPingResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const testPing = async () => {
    setIsLoading(true);
    setPingResult("");
    try {
      const data = await ping();
      setPingResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setPingResult(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <button
            onClick={testPing}
            disabled={isLoading}
            className="flex h-12 min-w-[158px] grow items-center justify-center gap-2 whitespace-nowrap rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Test Backend Ping"}
          </button>
        </div>
        {pingResult && (
          <div className="mt-8 w-full rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
            <pre className="text-sm text-black dark:text-zinc-50">
              {pingResult}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}
