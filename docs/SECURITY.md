# Security model

How access control works, and the invariants to preserve when changing this
codebase.

## Roles

| Role | Stored as | Can |
|---|---|---|
| Anonymous | no session | browse the catalogue and course detail pages |
| Student | `user.role = null` or `"user"` | access courses they hold an **active** enrollment in |
| Admin | `user.role = "admin"` | everything under `/admin`, all course and material management |

Promote the first admin manually:

```sql
UPDATE "user" SET role = 'admin' WHERE email = 'you@your-domain.com';
```

## Where authorization is enforced

There is no `middleware.ts`. Access is enforced at each entry point, which keeps
it visible in the file you are reading rather than in a matcher pattern
elsewhere.

**1. The `/admin` segment layout.** [`app/admin/layout.tsx`](../app/admin/layout.tsx)
calls `requireAdmin()`, covering every current and future page beneath it.
Because `requireAdmin()` reads `headers()`, it also forces the segment to render
dynamically — so admin data can never be statically prerendered into the build
output.

**2. The data access layer.** Every function in `app/data/admin/` calls
`requireAdmin()` independently, so a page that somehow bypassed the layout still
cannot read admin data.

**3. Route handlers.** These use [`lib/api-auth.ts`](../lib/api-auth.ts), which
returns 401/403 JSON instead of redirecting.

**4. Server Actions.** Every `actions.ts` begins with `requireAdmin()` or
`requireUser()`. A Server Action is a public POST endpoint — being unexported
from the UI protects nothing.

## Guard reference

| Guard | Use in | Failure |
|---|---|---|
| `requireAdmin()` | pages, data layer, Server Actions | redirect `/not-admin` |
| `requireUser()` | pages, Server Actions | redirect `/login` |
| `requireApiAdmin()` | route handlers | 403 JSON |
| `requireApiUser()` | route handlers | 401 JSON |
| `requireCourseAccess(courseId)` | route handlers | 403 unless enrolled or admin |

Never use `requireAdmin()` in a route handler. It answers with a redirect, so a
`fetch()` caller receives a 307 to `/login` and tries to parse HTML as JSON —
which reads as a confusing client bug rather than an access denial.

## Invariants

Breaking any of these reopens a hole that has already been fixed once.

1. **Every page under `/admin` is covered by the layout guard.** Do not remove
   `requireAdmin()` from `app/admin/layout.tsx`, and do not add an admin route
   outside that segment.

2. **Pages do not import Prisma directly.** Read through `app/data/`, which is
   where authorization lives. A page querying Prisma itself is how
   `/admin/user-management` came to leak every user's email.

3. **Every material route checks access.** Material metadata and download links
   are paid content. Reads require an active enrollment or admin; writes require
   admin.

4. **Presigned upload requests are validated server-side.** Content type and size
   come from the client and cannot be trusted. `api/s3/upload` enforces both and
   sanitises the filename before it becomes an object key.

5. **The Stripe webhook stays scoped.** It must match on `enrollmentId`, `userId`
   and `courseId` together. Matching on the id alone allowed an enrollment to be
   reassigned to another user.

6. **Guards run before the route's `try`/`catch`.** A guard inside the try block
   has its response swallowed and reported as a 500.

7. **`app/data/` files start with `import "server-only"`.** This turns an
   accidental client import into a build error instead of a data leak.

## Protection layers

**Arcjet** guards authentication, uploads and enrollment with rate limiting, bot
detection and signup protection (disposable-address and MX checks).

> An invalid `ARCJET_KEY` produces an `ERROR` decision, which the app treats as
> allow. Protection is then silently off while everything looks healthy. Confirm
> the Arcjet dashboard shows traffic after deploying.

**Content protection.** The PDF viewer and video player disable right-click and
common save and devtools shortcuts, and PDF links are short-lived signed URLs.
These raise the effort required; they are not a technical guarantee. Anyone who
can view content can capture it. Treat them as deterrents, not DRM.

**Environment validation.** [`lib/env.ts`](../lib/env.ts) validates every
variable at startup, including format checks on the Stripe and Resend keys and a
32-character minimum on `BETTER_AUTH_SECRET`, so a misconfigured deployment
fails at boot rather than at the first payment.

## Fixed in the production-hardening pass

Recorded so the same ground is not re-covered:

- `/admin/user-management` rendered every user's name, email, role and ban status
  to anonymous visitors, and was statically prerendered at build time.
- All `/api/materials/*` routes were unauthenticated. Anyone could list
  materials, upload arbitrary files into the bucket, delete materials, toggle
  visibility, or obtain a one-hour signed download link to any paid PDF from its
  id alone.
- `api/s3/upload` accepted any client-supplied content type and size.
- The Stripe webhook could reassign an enrollment to a different user, and threw
  on malformed events, causing Stripe to retry them indefinitely.
- The sign-in sender was hardcoded to `onboarding@resend.dev`, which only
  delivers to the Resend account owner.

## Reporting

Report a suspected vulnerability privately to the repository owner. Do not open
a public issue.
