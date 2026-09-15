import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, GraduationCap, BookOpen, Users } from "lucide-react";
import { UniversityStats } from "../../instructors/actions";

interface UniversitiesStatsCardsProps {
  stats: UniversityStats[];
}

const UNIVERSITY_NAMES: Record<string, string> = {
  UJ: "University of Jordan",
  PETRA: "Petra University",
};

export function UniversitiesStatsCards({ stats }: UniversitiesStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {stats.map((stat) => {
        const metrics = [
          { label: "Courses", value: stat.totalCourses, Icon: BookOpen },
          { label: "Instructors", value: stat.totalInstructors, Icon: GraduationCap },
          { label: "Students", value: stat.totalStudents, Icon: Users },
        ];

        const studentsPerCourse =
          stat.totalCourses > 0
            ? Math.round((stat.totalStudents / stat.totalCourses) * 10) / 10
            : 0;

        return (
          <Card
            key={stat.university}
            className="min-w-0 hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                  <Building className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-lg truncate">
                    {UNIVERSITY_NAMES[stat.university] ?? stat.university}
                  </CardTitle>
                  <Badge variant="outline" className="mt-1">
                    {stat.university}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {metrics.map(({ label, value, Icon }) => (
                  <div key={label} className="text-center">
                    <Icon className="h-4 w-4 text-muted-foreground mx-auto mb-2" />
                    <div className="text-2xl font-bold">{value}</div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Students per course</span>
                  <span className="font-medium">{studentsPerCourse}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
