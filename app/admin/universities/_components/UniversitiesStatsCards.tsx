import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, GraduationCap, BookOpen, Users } from "lucide-react";
import { UniversityStats } from "../../instructors/actions";

interface UniversitiesStatsCardsProps {
  stats: UniversityStats[];
}

export function UniversitiesStatsCards({ stats }: UniversitiesStatsCardsProps) {
  const getUniversityColor = (university: string) => {
    switch (university) {
      case "UJ":
        return {
          card: "border-green-200 bg-green-50/50",
          badge: "bg-green-100 text-green-800 border-green-200",
          icon: "text-green-600"
        };
      case "PETRA":
        return {
          card: "border-blue-200 bg-blue-50/50",
          badge: "bg-blue-100 text-blue-800 border-blue-200",
          icon: "text-blue-600"
        };
      default:
        return {
          card: "border-gray-200 bg-gray-50/50",
          badge: "bg-gray-100 text-gray-800 border-gray-200",
          icon: "text-gray-600"
        };
    }
  };

  const getUniversityName = (university: string) => {
    switch (university) {
      case "UJ":
        return "University of Jordan";
      case "PETRA":
        return "Petra University";
      default:
        return university;
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {stats.map((stat) => {
        const colors = getUniversityColor(stat.university);
        
        return (
          <Card key={stat.university} className={`${colors.card} hover:shadow-md transition-shadow`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-white ${colors.badge}`}>
                  <Building className={`h-6 w-6 ${colors.icon}`} />
                </div>
                <div>
                  <CardTitle className="text-xl">{getUniversityName(stat.university)}</CardTitle>
                  <Badge variant="outline" className={colors.badge}>
                    {stat.university}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <BookOpen className={`h-5 w-5 ${colors.icon} mr-1`} />
                  </div>
                  <div className="text-2xl font-bold">{stat.totalCourses}</div>
                  <p className="text-xs text-muted-foreground">Courses</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <GraduationCap className={`h-5 w-5 ${colors.icon} mr-1`} />
                  </div>
                  <div className="text-2xl font-bold">{stat.totalInstructors}</div>
                  <p className="text-xs text-muted-foreground">Instructors</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className={`h-5 w-5 ${colors.icon} mr-1`} />
                  </div>
                  <div className="text-2xl font-bold">{stat.totalStudents}</div>
                  <p className="text-xs text-muted-foreground">Students</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Total Enrollments</span>
                  <span className="font-medium">
                    {stat.totalCourses > 0 && stat.totalStudents > 0 
                      ? Math.round(stat.totalStudents / stat.totalCourses * 10) / 10
                      : 0
                    } per course
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
