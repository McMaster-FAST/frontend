"use client";

import { useEnrolments } from "@/hooks/useEnrolments";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, User } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchBar } from "@/components/ui/custom/saerch-bar";

interface ClassListProps {
  courseCode: string;
}

export function ClassList({ courseCode }: ClassListProps) {
  const { enrolments, isLoading, error } = useEnrolments(courseCode);
  const [search, setSearch] = useState("");

  const filteredStudents =
    enrolments?.filter((student) =>
      student.user_name.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load class list.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full">
      <Card className="w-full border-light-gray shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-lg font-bold text-slate-800">
              Enrolled Students
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage access and view student status
            </p>
          </div>

          <SearchBar
            className="w-64"
            placeholder="Search by name..."
            onSearch={setSearch}
          />
        </CardHeader>

        <CardContent className="p-0 border-t border-slate-100">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[70%] pl-6">User Name</TableHead>
                <TableHead className="w-[30%]">Role</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="pl-6">
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-32 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <User className="h-8 w-8 text-slate-300" />
                      <p>
                        {search
                          ? "No students found matching your search."
                          : "No students enrolled yet."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow
                    key={student.id}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <TableCell className="font-medium pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {student.user_name}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {student.is_instructor ? (
                        <Badge className="bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200">
                          Instructor
                        </Badge>
                      ) : student.is_ta ? (
                        <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                          Teaching Assistant
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-slate-100 text-slate-600 hover:bg-slate-200"
                        >
                          Student
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>

        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 bg-slate-50/50">
          <p className="text-xs text-muted-foreground">
            Showing {filteredStudents.length} of {enrolments?.length || 0}{" "}
            enrolled users
          </p>
        </div>
      </Card>
    </div>
  );
}
