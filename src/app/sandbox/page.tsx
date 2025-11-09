"use client";

import { Navbar } from "@/components/ui/navbar";

export default function Home() {
  return (

    <main>
      <Navbar username={"Logged in as: wardelp"} />

      <div className="p-8">
        <h1 className="text-2xl font-semibold">Sandbox</h1>
        <p className="mt-4">Use this page to preview the navbar and components.</p>
      </div>
    </main>

  );
}
