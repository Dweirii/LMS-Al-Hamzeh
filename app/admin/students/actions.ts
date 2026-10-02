"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { sanitizeRanges, WatchRange } from "@/lib/watch-progress";

export interface StudentSummary {
  id: string;
  name: string;
  email: string;
  role: string | null;
  banned: boolean | null;
  createdAt: Date;
  totalEnrolledCourses: number;
  totalCompletedLessons: number;
  averageProgressPercentage: number;
}

export interface LessonWatchDetails {
  id: string;
  title: string;
  hasVideo: boolean;
  completed: boolean;
  completedAt: Date | null;
  watchedSeconds: number;
  videoDuration: number;
  watchedRanges: WatchRange[];
  lastWatchedAt: Date | null;
}

export interface StudentDetails extends StudentSummary {
  enrollments: {
    id: string;
    course: {
      id: string;
      title: string;
      slug: string;
      status: string;
    };
    status: string;
    createdAt: Date;
    completedLessons: number;
    totalLessons: number;
    progressPercentage: number;
    chapters: {
      id: string;
      title: string;
      lessons: LessonWatchDetails[];
    }[];
  }[];
}

export interface StudentsStats {
  totalStudents: number;
  activeStudents: number;
  bannedStudents: number;
  averageCompletionRate: number;
}

export async function getStudentsStats(): Promise<ApiResponse & { data?: StudentsStats }> {
  await requireAdmin();
  try {
    const [
      totalStudents,
      activeStudents,
      bannedStudents,
      completionData
    ] = await Promise.all([
      // Total students (users with at least one enrollment)
      prisma.user.count({
        where: {
          enrollment: {
            some: {}
          }
        }
      }),
      
      // Active students (not banned, with enrollments)
      prisma.user.count({
        where: {
          banned: { not: true },
          enrollment: {
            some: {}
          }
        }
      }),
      
      // Banned students (banned, with enrollments)
      prisma.user.count({
        where: {
          banned: true,
          enrollment: {
            some: {}
          }
        }
      }),
      
      // Calculate average completion rate
      prisma.user.findMany({
        where: {
          enrollment: {
            some: {}
          }
        },
        select: {
          enrollment: {
            select: {
              Course: {
                select: {
                  chapter: {
                    select: {
                      lessons: {
                        select: {
                          id: true
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          lessonProgress: {
            where: {
              completed: true
            },
            select: {
              lessonId: true
            }
          }
        }
      })
    ]);

    // Calculate average completion rate
    let totalCompletionRate = 0;
    let studentsWithCourses = 0;

    for (const student of completionData) {
      let totalLessons = 0;
      let completedLessons = 0;

      // Count total lessons across all enrolled courses
      for (const enrollment of student.enrollment) {
        for (const chapter of enrollment.Course.chapter) {
          totalLessons += chapter.lessons.length;
        }
      }

      // Count completed lessons
      completedLessons = student.lessonProgress.length;

      if (totalLessons > 0) {
        totalCompletionRate += (completedLessons / totalLessons) * 100;
        studentsWithCourses++;
      }
    }

    const averageCompletionRate = studentsWithCourses > 0 
      ? totalCompletionRate / studentsWithCourses 
      : 0;

    return {
      status: "success",
      message: "Students stats retrieved successfully",
      data: {
        totalStudents,
        activeStudents,
        bannedStudents,
        averageCompletionRate: Math.round(averageCompletionRate * 100) / 100
      }
    };
  } catch {
    return {
      status: "error",
      message: "Failed to retrieve students stats",
    };
  }
}

export async function getStudents(): Promise<ApiResponse & { data?: StudentSummary[] }> {
  await requireAdmin();
  try {
    const students = await prisma.user.findMany({
      where: {
        enrollment: {
          some: {}
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        banned: true,
        createdAt: true,
        enrollment: {
          select: {
            Course: {
              select: {
                chapter: {
                  select: {
                    lessons: {
                      select: {
                        id: true
                      }
                    }
                  }
                }
              }
            }
          }
        },
        lessonProgress: {
          where: {
            completed: true
          },
          select: {
            lessonId: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    const studentsWithStats: StudentSummary[] = students.map(student => {
      let totalLessons = 0;
      const completedLessons = student.lessonProgress.length;

      // Count total lessons across all enrolled courses
      for (const enrollment of student.enrollment) {
        for (const chapter of enrollment.Course.chapter) {
          totalLessons += chapter.lessons.length;
        }
      }

      const averageProgressPercentage = totalLessons > 0 
        ? Math.round((completedLessons / totalLessons) * 100 * 100) / 100
        : 0;

      return {
        id: student.id,
        name: student.name,
        email: student.email,
        role: student.role,
        banned: student.banned,
        createdAt: student.createdAt,
        totalEnrolledCourses: student.enrollment.length,
        totalCompletedLessons: completedLessons,
        averageProgressPercentage
      };
    });

    return {
      status: "success",
      message: "Students retrieved successfully",
      data: studentsWithStats
    };
  } catch {
    return {
      status: "error",
      message: "Failed to retrieve students",
    };
  }
}

export async function getStudentDetails(studentId: string): Promise<ApiResponse & { data?: StudentDetails }> {
  await requireAdmin();
  try {
    const student = await prisma.user.findUnique({
      where: {
        id: studentId,
        enrollment: {
          some: {}
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        banned: true,
        createdAt: true,
        enrollment: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            Course: {
              select: {
                id: true,
                title: true,
                slug: true,
                status: true,
                chapter: {
                  orderBy: { position: "asc" },
                  select: {
                    id: true,
                    title: true,
                    lessons: {
                      orderBy: { position: "asc" },
                      select: {
                        id: true,
                        title: true,
                        videoKey: true
                      }
                    }
                  }
                }
              }
            }
          }
        },
        // Every row, not just completed ones: rows with completed = false
        // still carry watch time.
        lessonProgress: {
          select: {
            lessonId: true,
            completed: true,
            completedAt: true,
            watchedSeconds: true,
            videoDuration: true,
            watchedRanges: true,
            lastWatchedAt: true
          }
        }
      }
    });

    if (!student) {
      return {
        status: "error",
        message: "Student not found",
      };
    }

    const progressByLesson = new Map(
      student.lessonProgress.map(progress => [progress.lessonId, progress])
    );
    const completedProgress = student.lessonProgress.filter(progress => progress.completed);

    // Calculate stats for each enrolled course
    const enrollmentsWithStats = student.enrollment.map(enrollment => {
      let totalLessons = 0;
      
      // Count total lessons in this course
      for (const chapter of enrollment.Course.chapter) {
        totalLessons += chapter.lessons.length;
      }

      // Count completed lessons for this course
      const courseLessonIds = new Set();
      for (const chapter of enrollment.Course.chapter) {
        for (const lesson of chapter.lessons) {
          courseLessonIds.add(lesson.id);
        }
      }

      const completedLessons = completedProgress.filter(progress =>
        courseLessonIds.has(progress.lessonId)
      ).length;

      const chapters = enrollment.Course.chapter.map(chapter => ({
        id: chapter.id,
        title: chapter.title,
        lessons: chapter.lessons.map((lesson): LessonWatchDetails => {
          const progress = progressByLesson.get(lesson.id);
          return {
            id: lesson.id,
            title: lesson.title,
            hasVideo: Boolean(lesson.videoKey),
            completed: progress?.completed ?? false,
            completedAt: progress?.completedAt ?? null,
            watchedSeconds: progress?.watchedSeconds ?? 0,
            videoDuration: progress?.videoDuration ?? 0,
            watchedRanges: sanitizeRanges(progress?.watchedRanges, progress?.videoDuration ?? 0),
            lastWatchedAt: progress?.lastWatchedAt ?? null,
          };
        }),
      }));

      const progressPercentage = totalLessons > 0 
        ? Math.round((completedLessons / totalLessons) * 100 * 100) / 100
        : 0;

      return {
        id: enrollment.id,
        course: {
          id: enrollment.Course.id,
          title: enrollment.Course.title,
          slug: enrollment.Course.slug,
          status: enrollment.Course.status
        },
        status: enrollment.status,
        createdAt: enrollment.createdAt,
        completedLessons,
        totalLessons,
        progressPercentage,
        chapters
      };
    });

    // Calculate overall stats
    let totalLessons = 0;
    const completedLessons = completedProgress.length;

    for (const enrollment of student.enrollment) {
      for (const chapter of enrollment.Course.chapter) {
        totalLessons += chapter.lessons.length;
      }
    }

    const averageProgressPercentage = totalLessons > 0 
      ? Math.round((completedLessons / totalLessons) * 100 * 100) / 100
      : 0;

    const studentDetails: StudentDetails = {
      id: student.id,
      name: student.name,
      email: student.email,
      role: student.role,
      banned: student.banned,
      createdAt: student.createdAt,
      totalEnrolledCourses: student.enrollment.length,
      totalCompletedLessons: completedLessons,
      averageProgressPercentage,
      enrollments: enrollmentsWithStats
    };

    return {
      status: "success",
      message: "Student details retrieved successfully",
      data: studentDetails
    };
  } catch {
    return {
      status: "error",
      message: "Failed to retrieve student details",
    };
  }
}
