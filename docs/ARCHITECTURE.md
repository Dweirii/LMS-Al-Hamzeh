# Architecture

A Next.js 15 App Router application. Server Components read data directly;
mutations go through Server Actions; a small number of route handlers exist only
where the browser genuinely needs to call an endpoint.

## Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 15.3 (App Router, React 19) |
| Database | PostgreSQL via Prisma 6 |
| Auth | better-auth — GitHub OAuth + email one-time codes |
| Payments | Stripe Checkout + webhook |
| Storage | Tigris (S3-compatible), browser-direct uploads |
| Email | Resend |
| Protection | Arcjet — rate limiting, bot and signup protection |
| UI | Tailwind CSS 4, shadcn/ui (Radix), TipTap, Recharts |

## Route groups

```
app/
├── (auth)/          Sign-in and code verification
├── (public)/        Marketing page, course catalogue, course detail
├── admin/           Admin console — guarded as a whole by its layout
├── dashboard/       Enrolled student experience
├── api/             Route handlers (see below)
└── data/            Server-only data access layer
```

Route groups in parentheses affect layout only, not the URL.

## Data access layer

Everything under `app/data/` is server-only and marked with `import "server-only"`,
so importing one into a Client Component is a build error rather than a leak.

```
app/data/
├── admin/     Admin reads. Every function calls requireAdmin().
├── course/    Public course reads.
└── user/      Session helpers and enrollment checks.
```

Three guards enforce access, and which one to use depends on the caller:

| Guard | Where | On failure |
|---|---|---|
| `requireAdmin()` | `app/data/admin/` | redirects to `/not-admin` |
| `requireUser()` | `app/data/user/` | redirects to `/login` |
| `lib/api-auth.ts` | route handlers | returns 401/403 JSON |

The distinction matters. A redirect is right for a navigation but wrong for a
`fetch()`, which would receive a 307 to `/login` and try to parse an HTML page as
JSON. Route handlers therefore use `requireApiUser`, `requireApiAdmin` and
`requireCourseAccess` from [`lib/api-auth.ts`](../lib/api-auth.ts) instead.

## Route handlers

Most reads and writes are Server Components and Server Actions. These endpoints
exist because the browser has to call them directly:

| Route | Why it exists | Access |
|---|---|---|
| `api/auth/[...all]` | better-auth handler, wrapped in Arcjet | public |
| `api/webhook/stripe` | Stripe calls it | Stripe signature |
| `api/s3/upload` | presigned PUT for browser-direct upload | admin |
| `api/s3/delete` | removes an object | admin |
| `api/materials/upload` | material upload with a DB row | admin |
| `api/materials/[id]` | material metadata / delete | enrolled / admin |
| `api/materials/[id]/view` | signed, time-limited PDF link | enrolled / admin |
| `api/materials/[id]/visibility` | show or hide a material | admin |
| `api/courses/[courseId]/materials` | material list for a course | enrolled |

## Authentication flow

Two sign-in paths, both through better-auth:

1. **GitHub OAuth** — standard redirect flow.
2. **Email one-time code** — a code is emailed via Resend and exchanged for a
   session. Outside production the code is also printed to the server console,
   so the app can be signed into locally without a verified sending domain.

Sessions are cookie-based. Roles live in `user.role`; `"admin"` unlocks `/admin`.

Every POST to `/api/auth/*` passes through Arcjet first: signup requests get
email validation, rate limiting and bot detection; other auth requests get bot
detection.

> Arcjet's bot detection blocks `curl`, so testing auth endpoints from the
> command line needs browser-shaped headers — a `User-Agent` alone is not enough.

## Payment flow

```
Student clicks Enroll
  → enrollInCourseAction (Server Action)
      ├─ already enrolled?          → return early, no charge
      ├─ upsert Enrollment (Pending)
      ├─ create Stripe customer if needed
      └─ create Checkout Session    → redirect to Stripe
                                          │
Student pays on Stripe ────────────────────┘
  → POST /api/webhook/stripe
      ├─ verify signature
      └─ Enrollment → Active   (scoped to enrollmentId + userId + courseId)
```

Two deliberate properties:

- **Stripe is called outside any database transaction.** Holding a connection
  open across a network round-trip risks exceeding the transaction timeout and
  rolling back an enrollment for a session that was already created.
- **The webhook distinguishes retryable from non-retryable failures.** Malformed
  events are acknowledged with a 200, because redelivering them cannot help;
  only genuine database failures return a 500 for Stripe to retry.

Access is granted by the **webhook**, not by the success redirect. A student who
closes the browser during payment still gets access once the webhook arrives.

## Storage

Uploads bypass the server:

```
Browser → POST /api/s3/upload   (admin only; validates type and size)
        ← presigned PUT URL, 6 min expiry
Browser → PUT directly to the bucket
Browser → saves the returned object key with the course or lesson
```

The server never buffers the file, so large videos do not consume function
memory. Because type and size come from the client, the presign route validates
both server-side, mirroring the limits the uploader applies in the browser.

Records normally hold an object key. Absolute URLs are passed through untouched,
which is what lets seeded sample content work without bucket credentials.

PDF materials are **not** public: `api/materials/[id]/view` checks enrollment and
then returns a one-hour signed URL.

## Database model

```
User ──┬─< Enrollment >── Course ──< Chapter ──< Lesson
       │                     │                     │
       └──< LessonProgress >─┼─────────────────────┘
                             └──< Material
```

- `Enrollment` is unique on `(userId, courseId)` — one enrollment per student per
  course, reused rather than duplicated on re-purchase.
- `LessonProgress` is unique on `(userId, lessonId)`.
- Cascade deletes flow from `Course` down through chapters, lessons and materials.
- `Course.description` and `Lesson.description` hold **TipTap JSON**, not HTML.
  Render them through `RenderDescription`, which tolerates malformed values.

Schema changes go through migrations (`pnpm prisma:migrate` in development,
`pnpm prisma:deploy` in production), not `db push`.

## Conventions

- Feature-local components live in a `_components/` folder beside the route.
  The underscore keeps them out of routing.
- Shared primitives live in `components/ui/` (shadcn-generated).
- Server Actions live in `actions.ts` beside the route that uses them, and every
  one begins with a guard.
- Anything reading the database imports from `app/data/`, never Prisma directly
  in a page — with the data layer as the single place authorization is enforced.
