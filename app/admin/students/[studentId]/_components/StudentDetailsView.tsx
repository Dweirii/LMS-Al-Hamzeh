"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ExternalLink, BookOpen, CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { StudentDetails } from "../../actions";
import { StatusBadge } from "@/components/general/StatusBadge";
import { StatCard } from "@/components/general/StatCard";

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
    return <StatusBadge status={banned ? "Banned" : "Active"} />;
  };

  const getEnrollmentStatusBadge = (status: string) => {
    return <StatusBadge status={status} />;
  };

  const getCourseStatusBadge = (status: string) => {
    return <StatusBadge status={status} tone="neutral" />;
  };

  const formatDate = (date: Date) => {
    return format(date, "MMM dd, yyyy 'at' h:mm a");
  };

  return (
    <div className="space-y-6">
      <Link href="/admin/students" className="inline-flex">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4" />
          Back to Students
        </Button>
      </Link>

      {/* Header */}
      <Card className="flex-row flex-wrap items-center gap-5 px-6">
        <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-brand-soft font-serif text-2xl text-primary">
          {(student.name || student.email).charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-serif text-3xl font-medium tracking-tight">
              {student.name}
            </h1>
            <Badge variant={getRoleBadgeVariant(student.role)}>
              {student.role || "No Role"}
            </Badge>
            {getStatusBadge(student.banned)}
          </div>
          <p className="text-[14.5px] text-muted-foreground">{student.email}</p>
        </div>
      </Card>

      {/* Student Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Enrolled Courses"
          value={student.totalEnrolledCourses}
          description="Total enrollments"
          icon={<BookOpen />}
        />
        <StatCard
          title="Completed Lessons"
          value={student.totalCompletedLessons}
          description="Lessons finished"
          icon={<CheckCircle />}
          tone="success"
          colorValue
        />
        <StatCard
          title="Overall Progress"
          value={`${student.averageProgressPercentage}%`}
          description="Average completion"
          icon={<Clock />}
          tone="petra"
          colorValue
        >
          <Progress
            value={student.averageProgressPercentage}
            className="h-1.5"
          />
        </StatCard>
        <StatCard
          title="Member Since"
          value={format(student.createdAt, "MMM yyyy")}
          description={format(student.createdAt, "MMM dd, yyyy")}
          icon={<Clock />}
        />
      </div>

      {/* Enrolled Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl font-medium">
            Enrolled Courses
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Detailed progress for each enrolled course
          </p>
        </CardHeader>
        <CardContent>
          {student.enrollments.length === 0 ? (
            <div className="rounded-xl border border-dashed py-10 text-center">
              <BookOpen className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
              <h3 className="font-serif text-lg font-medium">No enrolled courses</h3>
              <p className="text-muted-foreground">
                This student hasn&apos;t enrolled in any courses yet.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {student.enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="flex flex-col gap-3 rounded-xl border p-4 transition-colors hover:bg-accent/40 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{enrollment.course.title}</h3>
                      {getEnrollmentStatusBadge(enrollment.status)}
                      {getCourseStatusBadge(enrollment.course.status)}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted-foreground">
                      <span>Enrolled: {formatDate(enrollment.createdAt)}</span>
                      <span aria-hidden="true">•</span>
                      <span>
                        {enrollment.completedLessons} of {enrollment.totalLessons} lessons completed
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Progress
                        value={enrollment.progressPercentage}
                        className="h-1.5 flex-1"
                      />
                      <span className="min-w-[3rem] text-right font-mono text-[13px] font-medium">
                        {enrollment.progressPercentage}%
                      </span>
                    </div>
                  </div>
                  <div className="sm:ml-4">
                    <Link href={`/admin/courses/${enrollment.course.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
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
