"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ExternalLink, BookOpen, CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { StudentDetails } from "../../actions";

interface StudentDetailsViewProps {
  student: StudentDetails;
}

export function StudentDetailsView({ student }: StudentDetailsViewProps) {
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

  const getEnrollmentStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case "Pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "Cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCourseStatusBadge = (status: string) => {
    switch (status) {
      case "Published":
        return <Badge variant="default" className="bg-green-500">Published</Badge>;
      case "Draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "Archived":
        return <Badge variant="outline">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return format(date, "MMM dd, yyyy 'at' h:mm a");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/students">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Students
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{student.name}</h1>
            <p className="text-muted-foreground">{student.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={getRoleBadgeVariant(student.role)}>
            {student.role || "No Role"}
          </Badge>
          {getStatusBadge(student.banned)}
        </div>
      </div>

      {/* Student Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{student.totalEnrolledCourses}</div>
            <p className="text-xs text-muted-foreground">
              Total enrollments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Lessons</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{student.totalCompletedLessons}</div>
            <p className="text-xs text-muted-foreground">
              Lessons finished
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {student.averageProgressPercentage}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average completion
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Member Since</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {format(student.createdAt, "MMM yyyy")}
            </div>
            <p className="text-xs text-muted-foreground">
              {format(student.createdAt, "MMM dd, yyyy")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enrolled Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Enrolled Courses</CardTitle>
          <p className="text-sm text-muted-foreground">
            Detailed progress for each enrolled course
          </p>
        </CardHeader>
        <CardContent>
          {student.enrollments.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No enrolled courses</h3>
              <p className="text-muted-foreground">
                This student hasn&apos;t enrolled in any courses yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {student.enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{enrollment.course.title}</h3>
                      {getCourseStatusBadge(enrollment.course.status)}
                      {getEnrollmentStatusBadge(enrollment.status)}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Enrolled: {formatDate(enrollment.createdAt)}</span>
                      <span>•</span>
                      <span>
                        {enrollment.completedLessons} of {enrollment.totalLessons} lessons completed
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress 
                        value={enrollment.progressPercentage} 
                        className="flex-1 h-2"
                      />
                      <span className="text-sm font-medium min-w-[3rem] text-right">
                        {enrollment.progressPercentage}%
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <Link href={`/admin/courses/${enrollment.course.id}`}>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Open Course
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
