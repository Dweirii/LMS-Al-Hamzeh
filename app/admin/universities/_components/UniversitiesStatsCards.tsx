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
    <div className="grid gap-5 md:grid-cols-2">
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
                <div
                  className={
                    stat.university === "UJ"
                      ? "shrink-0 rounded-xl bg-uj-soft p-3.5 text-uj"
                      : "shrink-0 rounded-xl bg-petra-soft p-3.5 text-petra"
                  }
                >
                  <Building className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="truncate font-serif text-2xl font-medium">
                    {UNIVERSITY_NAMES[stat.university] ?? stat.university}
                  </CardTitle>
                  <Badge
                    className={
                      stat.university === "UJ"
                        ? "mt-1.5 border-transparent bg-uj-soft text-uj"
                        : "mt-1.5 border-transparent bg-petra-soft text-petra"
                    }
                  >
                    {stat.university}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-3">
                {metrics.map(({ label, value, Icon }) => (
                  <div
                    key={label}
                    className="flex flex-col gap-1.5 rounded-xl bg-muted/60 p-4"
                  >
                    <Icon className="h-[18px] w-[18px] text-muted-foreground" />
                    <div className="font-serif text-3xl leading-none">{value}</div>
                    <p className="text-[12.5px] text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Students per course</span>
                  <span className="font-mono font-medium">{studentsPerCourse}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
