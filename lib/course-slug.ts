import "server-only";

import { prisma } from "@/lib/db";

// Titles are not unique (the same course can run at UJ and PETRA), but slugs are.
// Returns `slug` if free, otherwise the first free `slug-2`, `slug-3`, ...
export async function getUniqueCourseSlug(
  slug: string,
  excludeCourseId?: string
): Promise<string> {
  const taken = await prisma.course.findMany({
    where: {
      slug: { startsWith: slug },
      ...(excludeCourseId && { id: { not: excludeCourseId } }),
    },
    select: { slug: true },
  });

  const used = new Set(taken.map((course) => course.slug));
  if (!used.has(slug)) return slug;

  let suffix = 2;
  while (used.has(`${slug}-${suffix}`)) suffix++;
  return `${slug}-${suffix}`;
}
