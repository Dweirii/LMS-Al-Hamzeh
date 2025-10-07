"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Eye, Users } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { StudentSummary } from "../actions";

interface StudentsTableProps {
  students: StudentSummary[];
}

type FilterType = "all" | "active" | "banned";

export function StudentsTable({ students }: StudentsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const router = useRouter();

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = 
        filter === "all" ||
        (filter === "active" && !student.banned) ||
        (filter === "banned" && student.banned);
      
      return matchesSearch && matchesFilter;
    });
  }, [students, searchTerm, filter]);

  const getRoleBadgeVariant = (role: string | null) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "user":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusBadge = (banned: boolean | null) => {
    if (banned) {
      return <Badge variant="destructive">Banned</Badge>;
    }
    return <Badge variant="default" className="bg-green-500">Active</Badge>;
  };

  const formatDate = (date: Date) => {
    return format(date, "MMM dd, yyyy");
  };

  const handleViewDetails = (studentId: string) => {
    router.push(`/admin/students/${studentId}`);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filter} onValueChange={(value: FilterType) => setFilter(value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Students</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="banned">Banned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Students Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Enrolled Courses</TableHead>
              <TableHead>Completed Lessons</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{student.name}</div>
                    <div className="text-sm text-muted-foreground">{student.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(student.role)}>
                    {student.role || "No Role"}
                  </Badge>
                </TableCell>
                <TableCell>{getStatusBadge(student.banned)}</TableCell>
                <TableCell className="text-center">
                  <span className="font-medium">{student.totalEnrolledCourses}</span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="font-medium">{student.totalCompletedLessons}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Progress 
                      value={student.averageProgressPercentage} 
                      className="flex-1 h-2"
                    />
                    <span className="text-sm text-muted-foreground min-w-[3rem] text-right">
                      {student.averageProgressPercentage}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(student.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(student.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-8">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No students found</h3>
          <p className="text-muted-foreground">
            {searchTerm || filter !== "all" 
              ? "Try adjusting your search or filter criteria."
              : "No students have enrolled in courses yet."
            }
          </p>
        </div>
      )}
    </div>
  );
}
