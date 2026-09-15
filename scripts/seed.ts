/**
 * Seeds the database with sample content for local development.
 *
 * Usage:  pnpm db:seed
 *
 * Safe to re-run: courses and users are upserted by their unique keys, and
 * chapters, lessons and materials are only created for courses that are new.
 *
 * Media points at public sample files rather than the storage bucket, so the UI
 * is reviewable without Tigris credentials. lib/env.ts and the material view
 * route pass absolute URLs through untouched.
 */
import { PrismaClient, type CourseLevel, type University } from "@prisma/client";

const prisma = new PrismaClient();

const VIDEOS = [
  "https://media.w3.org/2010/05/sintel/trailer.mp4",
  "https://media.w3.org/2010/05/bunny/movie.mp4",
  "https://media.w3.org/2010/05/bunny/trailer.mp4",
  "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
  "https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4",
  "https://media.w3.org/2010/05/video/movie_300.mp4",
];

const PDFS = [
  "https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf",
  "https://pdfobject.com/pdf/sample.pdf",
];

const COURSES: Array<{
  slug: string;
  title: string;
  category: string;
  level: CourseLevel;
  price: number;
  duration: number;
  university: University;
  cover: string;
}> = [
  { slug: "calculus-i", title: "Calculus I", category: "Mathematics", level: "Beginner", price: 45, duration: 12, university: "UJ", cover: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&q=80" },
  { slug: "organic-chemistry", title: "Organic Chemistry", category: "Chemistry", level: "Intermediate", price: 60, duration: 16, university: "UJ", cover: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=80" },
  { slug: "data-structures", title: "Data Structures & Algorithms", category: "Computer Science", level: "Advanced", price: 75, duration: 20, university: "PETRA", cover: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80" },
  { slug: "human-anatomy", title: "Human Anatomy", category: "Medicine", level: "Beginner", price: 90, duration: 24, university: "PETRA", cover: "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=1200&q=80" },
];

const CHAPTERS = ["Foundations", "Core Concepts", "Applications"];
const LESSONS = ["Introduction", "Theory", "Worked Example", "Practice Set"];

/** Course and lesson descriptions are stored as TipTap JSON, not HTML. */
function richText(paragraph: string) {
  return JSON.stringify({
    type: "doc",
    content: [{ type: "paragraph", content: [{ type: "text", text: paragraph }] }],
  });
}

async function main() {
  const now = new Date();

  const admin = await prisma.user.upsert({
    where: { email: "admin@alhamzeh.test" },
    update: {},
    create: {
      id: "seed-admin", name: "Al-Hamzeh Admin", email: "admin@alhamzeh.test",
      emailVerified: true, role: "admin", createdAt: now, updatedAt: now,
    },
  });

  const student = await prisma.user.upsert({
    where: { email: "student@alhamzeh.test" },
    update: {},
    create: {
      id: "seed-student", name: "Omar Al-Student", email: "student@alhamzeh.test",
      emailVerified: true, role: "user", createdAt: now, updatedAt: now,
    },
  });

  let video = 0;
  let pdf = 0;

  for (const [index, spec] of COURSES.entries()) {
    const existing = await prisma.course.findUnique({ where: { slug: spec.slug } });

    const course = await prisma.course.upsert({
      where: { slug: spec.slug },
      update: { fileKey: spec.cover },
      create: {
        title: spec.title, slug: spec.slug, category: spec.category, level: spec.level,
        price: spec.price, duration: spec.duration, university: spec.university,
        status: "Published", stripePriceId: `price_seed_${spec.slug}`,
        fileKey: spec.cover,
        smallDescription: `A complete ${spec.title} course, from fundamentals to applied practice.`,
        description: richText(`This course walks through ${spec.title} from first principles, with worked examples and downloadable materials.`),
        userId: admin.id, instructorId: admin.id,
      },
    });

    // Only build out structure for courses this run created.
    if (!existing) {
      for (const [c, chapterTitle] of CHAPTERS.entries()) {
        const chapter = await prisma.chapter.create({
          data: { title: `Chapter ${c + 1}: ${chapterTitle}`, position: c + 1, courseId: course.id },
        });

        for (const [l, lessonTitle] of LESSONS.entries()) {
          await prisma.lesson.create({
            data: {
              title: `Lesson ${c + 1}.${l + 1} — ${lessonTitle}`,
              description: richText("Lesson overview and learning objectives."),
              position: l + 1, chapterId: chapter.id,
              videoKey: VIDEOS[video++ % VIDEOS.length],
              thumbnailKey: spec.cover,
            },
          });
        }
      }

      await prisma.material.createMany({
        data: [
          { title: `${spec.title} — Lecture Notes.pdf`, fileKey: PDFS[pdf++ % PDFS.length], courseId: course.id, isVisible: true },
          { title: `${spec.title} — Problem Sheet.pdf`, fileKey: PDFS[pdf++ % PDFS.length], courseId: course.id, isVisible: true },
        ],
      });
    }

    // Enrol the sample student in the first two courses only, so the
    // "not enrolled" path stays reviewable.
    if (index < 2) {
      await prisma.enrollment.upsert({
        where: { userId_courseId: { userId: student.id, courseId: course.id } },
        update: {},
        create: { userId: student.id, courseId: course.id, amount: spec.price, status: "Active" },
      });
    }
  }

  const [courses, chapters, lessons, materials, users, enrollments] = await Promise.all([
    prisma.course.count(), prisma.chapter.count(), prisma.lesson.count(),
    prisma.material.count(), prisma.user.count(), prisma.enrollment.count(),
  ]);

  console.log(
    `Seeded: ${courses} courses, ${chapters} chapters, ${lessons} lessons, ` +
    `${materials} materials, ${users} users, ${enrollments} enrollments`
  );
  console.log("Sign in as admin@alhamzeh.test or student@alhamzeh.test.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
