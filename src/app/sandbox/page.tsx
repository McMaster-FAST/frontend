"use client";

import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "@/components/ui/pagination";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@radix-ui/react-dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { ChevronDown } from "lucide-react";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { MacFastHeader } from "@/components/ui/custom/macfast-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import CourseCard from "@/components/ui/custom/course-card";
import UnitsAccordion from "@/components/ui/custom/unit-accordion/unit-accordion";
import { Questions } from "@/app/courses/[courseCode]/dashboard/tabs/questions-tab";
import debounce from "lodash/debounce";

interface QuestionRow {
  question: string;
  difficulty: number;
  usage: string;
  flagged: boolean;
  verified: boolean;
}

const questionsData: QuestionRow[] = [
  {
    question: "What is the capital of France?",
    difficulty: 95,
    usage: "Geography",
    flagged: false,
    verified: true,
  },
  {
    question: "Solve for x: 2x + 3 = 7",
    difficulty: 70,
    usage: "Mathematics",
    flagged: true,
    verified: false,
  },
];

export default function Home() {
  const [activePage, setActivePage] = React.useState(1);
  return (
    <main>
      <div>
        <Button variant="secondary" className="w-[300px]" onClick={debounce((event) => console.log("Debounced!"), 1000)}>
          Content
        </Button>

        <MacFastHeader/>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="tertiary">Tertiary</Button>

        <Checkbox id="checkbox-1" />
        <Label htmlFor="checkbox-1">Check me!</Label>

        <RadioGroup id="radio-group-1">
          <RadioGroupItem value="option1" id="option1" />
          <Label htmlFor="option1">Check me!</Label>
          <RadioGroupItem value="option2" id="option2" />
          <Label htmlFor="option2">No, check me!</Label>
        </RadioGroup>
        <Pagination>
          <PaginationPrevious onClick={() => setActivePage(activePage - 1)} />
          <PaginationLink
            onClick={() => setActivePage(1)}
            isActive={activePage === 1}
          >
            1
          </PaginationLink>
          <PaginationLink
            onClick={() => setActivePage(2)}
            isActive={activePage === 2}
          >
            2
          </PaginationLink>
          <PaginationLink
            onClick={() => setActivePage(3)}
            isActive={activePage === 3}
          >
            3
          </PaginationLink>
          <PaginationNext onClick={() => setActivePage(activePage + 1)} />
        </Pagination>
        <Input
          className="w-[600px]"
          placeholder="Enter text"
          label="Default"
          errorMessage="Wrong answer!"
          error={true}
        />
        <Textarea
          className="w-[600px]"
          placeholder="Enter more text"
          label="Default Label"
          error
          errorMessage=""
        />
        <DropdownMenu>
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuTrigger>
            <ChevronDown />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => console.log("Item 1 selected")}>
                Item 1
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => console.log("Item 2 selected")}>
                Item 2
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => console.log("Item 3 selected")}>
              Item 3
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Progress value={50} className="w-[600px] mt-4" />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Flagged</TableHead>
              <TableHead>Verified</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questionsData.map((question, index) => (
              <TableRow key={index}>
                <TableCell>{question.question}</TableCell>
                <TableCell>{question.difficulty}</TableCell>
                <TableCell>{question.usage}</TableCell>
                <TableCell>{question.flagged ? "Yes" : "No"}</TableCell>
                <TableCell>{question.verified ? "Yes" : "No"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="h-[100px]"></div>
        <CourseCard
          course={{
            code: "CS101",
            name: "Introduction to Computer Science",
            year: 2024,
            semester: 1,
          }}
          progress={25}
        />
        <div className="h-[100px]"></div>
        <UnitsAccordion
          units={[
            {
              name: "Introduction",
              number: "1",
              unitAbilityScore: -0.1,
              subtopics: [
                {
                  name: "What is Computer Science?",
                  attempted: true,
                  abilityScore: -0.1,
                },
              ],
            },
            {
              name: "Programming Basics",
              number: "2",
              subtopics: [
                { name: "Variables" },
                { name: "Control Structures" },
              ],
            },
          ]}
        />
        <div className="h-[100px]"></div>
        <Questions />
      </div>
    </main>
  );
}
