"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export interface InstructorSummary {
  id: string;
  name: string;
  email: string;
  university: string;
  totalCourses: number;
  createdAt: Date;
}

export interface InstructorDetails extends InstructorSummary {
  courses: {
    id: string;
    title: string;
    slug: string;
    status: string;
    university: string;
    createdAt: Date;
    totalEnrollments: number;
  }[];
}

export interface UniversityStats {
  university: string;
  totalCourses: number;
  totalInstructors: number;
  totalStudents: number;
}

export async function getInstructors(): Promise<ApiResponse & { data?: InstructorSummary[] }> {
  await requireAdmin();
  try {
    const instructors = await prisma.user.findMany({
      where: {
        role: "instructor"
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        instructorCourses: {
          select: {
            id: true,
            university: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    const instructorsWithStats: InstructorSummary[] = instructors.map(instructor => {
      // Get university from the first course, or default to UJ
      const university = instructor.instructorCourses.length > 0 
        ? instructor.instructorCourses[0].university 
        : "UJ";

      return {
        id: instructor.id,
        name: instructor.name,
        email: instructor.email,
        university,
        totalCourses: instructor.instructorCourses.length,
        createdAt: instructor.createdAt
      };
    });

    return {
      status: "success",
      message: "Instructors retrieved successfully",
      data: instructorsWithStats
    };
  } catch {
    return {
      status: "error",
      message: "Failed to retrieve instructors",
    };
  }
}

export async function getInstructorDetails(instructorId: string): Promise<ApiResponse & { data?: InstructorDetails }> {
  await requireAdmin();
  try {
    const instructor = await prisma.user.findUnique({
      where: {
        id: instructorId,
        role: "instructor"
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        instructorCourses: {
          select: {
            id: true,
            title: true,
            slug: true,
            status: true,
            university: true,
            createdAt: true,
            enrollment: {
              select: {
                id: true
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    });

    if (!instructor) {
      return {
        status: "error",
        message: "Instructor not found",
      };
    }

    // Get university from the first course, or default to UJ
    const university = instructor.instructorCourses.length > 0 
      ? instructor.instructorCourses[0].university 
      : "UJ";

    const coursesWithStats = instructor.instructorCourses.map(course => ({
      id: course.id,
      title: course.title,
      slug: course.slug,
      status: course.status,
      university: course.university,
      createdAt: course.createdAt,
      totalEnrollments: course.enrollment.length
    }));

    const instructorDetails: InstructorDetails = {
      id: instructor.id,
      name: instructor.name,
      email: instructor.email,
      university,
      totalCourses: instructor.instructorCourses.length,
      createdAt: instructor.createdAt,
      courses: coursesWithStats
    };

    return {
      status: "success",
      message: "Instructor details retrieved successfully",
      data: instructorDetails
    };
  } catch {
    return {
      status: "error",
      message: "Failed to retrieve instructor details",
    };
  }
}

export async function createInstructor(
  name: string,
  email: string
): Promise<ApiResponse> {
  await requireAdmin();
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return {
        status: "error",
        message: "User with this email already exists",
      };
    }

    // Create new user with instructor role
    await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        name,
        email,
        emailVerified: false,
        role: "instructor",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    revalidatePath("/admin/instructors");
    return {
      status: "success",
      message: "Instructor created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create instructor",
    };
  }
}

export async function updateInstructor(
  instructorId: string,
  name: string,
  email: string
): Promise<ApiResponse> {
  await requireAdmin();
  try {
    // Check if email is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        id: { not: instructorId }
      }
    });

    if (existingUser) {
      return {
        status: "error",
        message: "Email is already taken by another user",
      };
    }

    await prisma.user.update({
      where: {
        id: instructorId,
        role: "instructor"
      },
      data: {
        name,
        email,
        updatedAt: new Date()
      }
    });

    revalidatePath("/admin/instructors");
    return {
      status: "success",
      message: "Instructor updated successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to update instructor",
    };
  }
}

export async function deleteInstructor(instructorId: string): Promise<ApiResponse> {
  await requireAdmin();
  try {
    // Check if instructor has courses
    const instructorWithCourses = await prisma.user.findUnique({
      where: {
        id: instructorId,
        role: "instructor"
      },
      select: {
        instructorCourses: {
          select: {
            id: true
          }
        }
      }
    });

    if (!instructorWithCourses) {
      return {
        status: "error",
        message: "Instructor not found",
      };
    }

    if (instructorWithCourses.instructorCourses.length > 0) {
      return {
        status: "error",
        message: "Cannot delete instructor with assigned courses. Please reassign courses first.",
      };
    }

    await prisma.user.delete({
      where: {
        id: instructorId,
        role: "instructor"
      }
    });

    revalidatePath("/admin/instructors");
    return {
      status: "success",
      message: "Instructor deleted successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to delete instructor",
    };
  }
}

export async function getUniversityStats(): Promise<ApiResponse & { data?: UniversityStats[] }> {
  await requireAdmin();
  try {
    const [ujStats, petraStats] = await Promise.all([
      // UJ Stats
      prisma.course.aggregate({
        where: {
          university: "UJ"
        },
        _count: {
          id: true
        }
      }),
      // PETRA Stats
      prisma.course.aggregate({
        where: {
          university: "PETRA"
        },
        _count: {
          id: true
        }
      })
    ]);

    const [ujInstructors, petraInstructors] = await Promise.all([
      // UJ Instructors
      prisma.user.count({
        where: {
          role: "instructor",
          instructorCourses: {
            some: {
              university: "UJ"
            }
          }
        }
      }),
      // PETRA Instructors
      prisma.user.count({
        where: {
          role: "instructor",
          instructorCourses: {
            some: {
              university: "PETRA"
            }
          }
        }
      })
    ]);

    const [ujStudents, petraStudents] = await Promise.all([
      // UJ Students
      prisma.user.count({
        where: {
          enrollment: {
            some: {
              Course: {
                university: "UJ"
              }
            }
          }
        }
      }),
      // PETRA Students
      prisma.user.count({
        where: {
          enrollment: {
            some: {
              Course: {
                university: "PETRA"
              }
            }
          }
        }
      })
    ]);

    const stats: UniversityStats[] = [
      {
        university: "UJ",
        totalCourses: ujStats._count.id,
        totalInstructors: ujInstructors,
        totalStudents: ujStudents
      },
      {
        university: "PETRA",
        totalCourses: petraStats._count.id,
        totalInstructors: petraInstructors,
        totalStudents: petraStudents
      }
    ];

    return {
      status: "success",
      message: "University stats retrieved successfully",
      data: stats
    };
  } catch {
    return {
      status: "error",
      message: "Failed to retrieve university stats",
    };
  }
}
