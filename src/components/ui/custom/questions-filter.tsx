"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, FilterIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QuestionsFilterProps {
  subtopics: Subtopic[];
  filters: QuestionFilters;
  onFilterChange: (filters: QuestionFilters) => void;
}

export function QuestionsFilter({
  subtopics,
  filters,
  onFilterChange,
}: QuestionsFilterProps) {
  const [open, setOpen] = useState(false);

  const sliderValue = [
    filters.min_difficulty ?? 0,
    filters.max_difficulty ?? 1,
  ];

  const handleSliderChange = (value: number[]) => {
    const minVal = value[0] > 0 ? value[0] : undefined;
    const maxVal = value[1] < 1 ? value[1] : undefined;

    onFilterChange({
      ...filters,
      min_difficulty: minVal,
      max_difficulty: maxVal,
    });
  };

  const handleToggleChange = (
    key: "is_verified" | "is_flagged",
    val: boolean | null,
  ) => {
    onFilterChange({ ...filters, [key]: val });
  };

  const handleSubtopicChange = (value: string) => {
    const newVal = value === "all" ? null : value;
    onFilterChange({ ...filters, subtopic_name: newVal });
  };

  const clearFilters = () => {
    onFilterChange({});
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="primary" className="gap-2 group">
          <FilterIcon className="h-5 w-5" />
          Filters
          <ChevronDown className="h-4 w-4 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="grid gap-5">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Verification Status
            </Label>
            <FilterToggle
              value={filters.is_verified}
              onChange={(val) => handleToggleChange("is_verified", val)}
              labelTrue="Verified"
              labelFalse="Unverified"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Flag Status
            </Label>
            <FilterToggle
              value={filters.is_flagged}
              onChange={(val) => handleToggleChange("is_flagged", val)}
              labelTrue="Flagged"
              labelFalse="Not Flagged"
            />
          </div>

          <div className="border-t" />

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Difficulty
              </Label>
              <span className="text-sm text-muted-foreground">
                {sliderValue[0].toFixed(2)} - {sliderValue[1].toFixed(2)}
              </span>
            </div>

            <Slider
              value={sliderValue}
              min={0}
              max={1}
              step={0.01}
              minStepsBetweenThumbs={1}
              onValueChange={handleSliderChange}
              className="py-1"
            />

            <div className="flex justify-between text-xs text-muted-foreground px-1">
              <span>0.0</span>
              <span>0.5</span>
              <span>1.0</span>
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Subtopic
            </Label>
            <Select
              value={filters.subtopic_name ?? "all"}
              onValueChange={handleSubtopicChange}
            >
              <SelectTrigger className="h-8 w-full">
                <SelectValue placeholder="Select subtopic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subtopics</SelectItem>
                {subtopics.map((sub) => (
                  <SelectItem key={sub.name} value={sub.name}>
                    {sub.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center">
            <Button
              variant="tertiary"
              className="h-auto ml-auto"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function FilterToggle({
  value,
  onChange,
  labelTrue,
  labelFalse,
}: {
  value?: boolean | null;
  onChange: (val: boolean | null) => void;
  labelTrue: string;
  labelFalse: string;
}) {
  return (
    <div className="flex p-1 bg-slate-100 rounded-lg dark:bg-slate-800">
      <ToggleBtn
        isActive={value === true}
        onClick={() => onChange(true)}
        label={labelTrue}
      />
      <ToggleBtn
        isActive={value === false}
        onClick={() => onChange(false)}
        label={labelFalse}
      />
      <ToggleBtn
        isActive={value === null || value === undefined}
        onClick={() => onChange(null)}
        label="Both"
      />
    </div>
  );
}

function ToggleBtn({
  isActive,
  onClick,
  label,
}: {
  isActive: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 text-xs font-medium py-1.5 px-2 rounded-md transition-all duration-200",
        isActive
          ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100"
          : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200",
      )}
    >
      {label}
    </button>
  );
}
