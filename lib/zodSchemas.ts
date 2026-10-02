import { z } from "zod";

export const courseLevels = ["Beginner", "Intermediate", "Advanced"] as const;

export const courseStatus = ["Draft", "Published", "Archived"] as const;

export const universities = ["UJ", "PETRA"] as const;

export const userRoles = ["user", "admin", "instructor"] as const;

// Kinds of admin. A label only: every admin has the same access to /admin.
// These arrays double as the option list in the user-management role dialog.
export const adminTypes = [
  "general",
  "technical_support",
  "call_center",
  "content_manager",
  "finance",
] as const;

export type AdminType = (typeof adminTypes)[number];

export const adminTypeDetails: Record<
  AdminType,
  { label: string; description: string }
> = {
  general: { label: "General admin", description: "Runs the platform" },
  technical_support: {
    label: "Technical support",
    description: "Fixes account and access issues",
  },
  call_center: {
    label: "Call center",
    description: "Handles student calls and enrollments",
  },
  content_manager: {
    label: "Content manager",
    description: "Manages courses and materials",
  },
  finance: { label: "Finance", description: "Payments and enrollments" },
};

export const courseCategories = [
  "Medicine",
  "Dental",
  "Pharmacy",
  "Engineering",
  "IT",
  "Business",
] as const;

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must be at most 100 characters long" }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters long" }),

  // Optional: an empty key means "no thumbnail", shown as the default logo image.
  fileKey: z.string(),

  price: z.coerce
    .number()
    .int({ message: "Price must be a whole number" })
    .min(0, { message: "Price cannot be negative (use 0 for a free course)" }),

  duration: z.coerce
    .number()
    .min(1, { message: "Duration must be at least 1 hour" })
    .max(500, { message: "Duration must be at most 500 hours" }),

  level: z.enum(courseLevels, {
    message: "Level is required",
  }),
  category: z.enum(courseCategories, {
    message: "Category is required",
  }),
  smallDescription: z
    .string()
    .min(3, { message: "Small Description must be at least 3 characters long" })
    .max(200, {
      message: "Small Description must be at most 200 characters long",
    }),

  slug: z
    .string()
    .min(3, { message: "Slug must be at least 3 characters long" })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug may only contain lowercase letters, numbers and hyphens",
    }),

  status: z.enum(courseStatus, {
    message: "Status is required",
  }),
  
  instructorId: z.string().uuid({ message: "Invalid instructor ID" }).optional(),
  university: z.enum(universities, {
    message: "University is required",
  }),
});

export const chapterSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  courseId: z.string().uuid({ message: "Invalid course id" }),
});

export const lessonSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  chapterId: z.string().uuid({ message: "Invalid chapter ID" }),
  courseId: z.string().uuid({ message: "Invalid course ID" }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters long" })
    .optional(),

  videoKey: z.string().optional(),
  thumbnailKey: z.string().optional(),
});

export const userRoleSchema = z
  .object({
    userId: z.string().min(1, { message: "Invalid user id" }),
    role: z.enum(userRoles, { message: "Role is required" }),
    adminType: z.enum(adminTypes).optional(),
  })
  .refine((value) => value.role !== "admin" || value.adminType !== undefined, {
    message: "Choose an admin type",
    path: ["adminType"],
  });

export type CourseSchemaType = z.infer<typeof courseSchema>;
export type ChapterSchemaType = z.infer<typeof chapterSchema>;
export type LessonSchemaType = z.infer<typeof lessonSchema>;
export type UserRoleSchemaType = z.infer<typeof userRoleSchema>;
