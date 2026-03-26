"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  const [currentTab, setCurrentTab] = useState("");

  const updateTab = (value: string) => {
    window.location.hash = value;
    setCurrentTab(value);
  };
  useEffect(() => {
    const tabFromHash = window.location.hash.substring(1);
    updateTab(tabFromHash || props.defaultValue || "");
  }, []);

  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      value={currentTab}
      onValueChange={updateTab}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <div className="mb-8 overflow-x-auto pb-2 mx-auto shrink-0 w-full flex justify-start md:justify-center">
      <TabsPrimitive.List
        data-slot="tabs-list"
        className={cn(
          "h-12 gap-2 bg-transparent p-0 text-foreground border-b-2 border-dark-gray inline-flex w-fit items-center justify-start",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "group flex gap-2 rounded-full border border-transparent px-6 py-2 data-[state=active]:border-light-gray data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary",
        "h-full max-w-fit focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:text-foreground inline-flex flex-1 items-center justify-center border-b-2 text-sm font-medium whitespace-nowrap focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-dark-gray [&_svg]:group-data-[state=active]:text-primary-hover",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
