# Al-Hamzeh LMS

A learning management system for university course delivery — course catalogue,
enrolment and payment, video lessons with progress tracking, and protected PDF
course materials.

Built with Next.js 15, Prisma and PostgreSQL.

## Documentation

| Guide | For |
|---|---|
| [Configuration](docs/CONFIGURATION.md) | What every environment variable does and what breaks when it is wrong |
| [Deployment](docs/DEPLOYMENT.md) | Deploying to Vercel, end to end |
| [Architecture](docs/ARCHITECTURE.md) | How the codebase fits together |
| [Security](docs/SECURITY.md) | The access model and the invariants to preserve |

## Features

**Students** browse a catalogue filterable by university, category and level, buy
a course through Stripe Checkout, then work through chapters and lessons with
video playback, per-lesson progress tracking and downloadable PDF materials.

**Admins** manage courses, chapters and lessons with drag-and-drop reordering and
a rich-text editor, upload images and video directly to object storage, publish
PDF materials per course, and manage students, instructors and roles from a
dashboard with enrolment statistics.

## Requirements

- Node.js 20 or newer
- pnpm 9 or newer
- PostgreSQL 14 or newer
- Accounts with Tigris (or any S3-compatible store), Resend, Stripe and Arcjet,
  plus a GitHub OAuth app

## Local setup

```bash
git clone https://github.com/Dweirii/LMS-Al-Hamzeh.git
cd LMS-Al-Hamzeh
pnpm install
```

Create your environment file:

```bash
cp .env.example .env
```

Fill it in. Every variable is required and the app refuses to start if one is
missing — see [Configuration](docs/CONFIGURATION.md) for where each value comes
from. For a first local run, only `DATABASE_URL` needs to be real; the rest can
stay as placeholders, with the limitations noted below.

Create the schema and add sample content:

```bash
pnpm prisma:generate
pnpm prisma:deploy     # or prisma:push for a throwaway database
pnpm db:seed
```

Start the dev server:

```bash
pnpm dev
```

Then open <http://localhost:3000>.

> `BETTER_AUTH_URL` must match the port you are actually serving on. If Next
> falls back to another port because 3000 is busy, update it — otherwise sign-in
> fails with a misleading "Error sending email".

### Signing in locally

The seed creates two accounts:

| Email | Role |
|---|---|
| `admin@alhamzeh.test` | admin |
| `student@alhamzeh.test` | student, enrolled in two courses |

Sign in with a one-time code. Because a placeholder Resend key cannot deliver
email, **the code is printed to the terminal running `pnpm dev`** outside
production. Enter the email, then copy the code from the server log.

Promote any other account with:

```sql
UPDATE "user" SET role = 'admin' WHERE email = 'you@example.com';
```

### What works without real credentials

Seeded media points at public sample files, so the full UI — course pages, video
playback and PDF materials — is reviewable with placeholder credentials.

Uploads and payments are not: they need real Tigris and Stripe keys.

## Scripts

```bash
pnpm dev                  # dev server (Turbopack)
pnpm build                # production build
pnpm start                # serve the production build
pnpm lint                 # ESLint
pnpm typecheck            # tsc --noEmit

pnpm prisma:generate      # regenerate the Prisma client
pnpm prisma:push          # push schema without a migration (development only)
pnpm prisma:migrate       # create and apply a migration
pnpm prisma:deploy        # apply pending migrations (production)
pnpm prisma:studio        # database browser
pnpm db:seed              # sample content (idempotent)

pnpm cleanup:enrollments  # remove orphaned enrollments
pnpm cleanup:orphans      # remove orphaned chapters
```

## Project layout

```
app/
├── (auth)/       sign-in and code verification
├── (public)/     landing page, catalogue, course detail
├── admin/        admin console (guarded by its layout)
├── dashboard/    enrolled student experience
├── api/          route handlers
└── data/         server-only data access, where authorization lives
components/       shared UI (shadcn/ui), uploader, rich-text editor
lib/              env validation, auth, Prisma, Stripe, S3, Arcjet
prisma/           schema and migrations
scripts/          seed and maintenance scripts
docs/             the guides listed above
```

See [Architecture](docs/ARCHITECTURE.md) for how these fit together.

## Database changes

Development:

```bash
# edit prisma/schema.prisma, then
pnpm prisma:migrate --name describe_your_change
```

Production applies the resulting migrations with `pnpm prisma:deploy`. Avoid
`prisma db push` outside local work — it changes the schema with no history or
review.

## Deployment

See [Deployment](docs/DEPLOYMENT.md). In short: provision Postgres and a storage
bucket, verify an email sending domain, set the environment variables, deploy,
run `pnpm prisma:deploy`, then register the Stripe webhook and redeploy.

Two failure modes are silent and worth checking explicitly after any deploy — an
unverified Resend domain (nobody can sign in by email) and an invalid Arcjet key
(rate limiting is off). The post-deployment checklist covers both.
