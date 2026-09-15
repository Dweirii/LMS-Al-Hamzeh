# Deploying to Vercel

End-to-end guide for a first production deployment. Budget about an hour, mostly
spent waiting on DNS and provider verification.

Every variable named here is described in detail in
[CONFIGURATION.md](./CONFIGURATION.md).

---

## Before you start

Create accounts and collect credentials for all five providers first. Deploying
with placeholders and filling them in later means the app boots into a broken
state, and two of the failures are silent.

| Provider | Purpose | Sign up |
|---|---|---|
| PostgreSQL host | Database | Neon, Supabase, Railway, RDS |
| Tigris (or any S3) | Images, videos, PDFs | <https://console.tigris.dev> |
| Resend | Sign-in code emails | <https://resend.com> |
| Stripe | Course payments | <https://dashboard.stripe.com> |
| Arcjet | Rate limiting, bot protection | <https://app.arcjet.com> |
| GitHub OAuth app | "Sign in with GitHub" | <https://github.com/settings/developers> |

You also need your production domain decided, since four of these need the exact
URL.

---

## 1. Provision the database

Create a Postgres instance and copy its connection string.

- Append `?sslmode=require` if the provider requires TLS.
- Prefer the **pooled** connection string if offered. Vercel functions open a
  connection per instance and can exhaust a direct connection limit under load.

Do not create tables by hand — step 6 does that.

## 2. Create the storage bucket

In Tigris, create a bucket and generate an access key pair.

Configure the bucket for:
- **Public read.** Browsers fetch images and videos directly.
- **CORS allowing `PUT` from your domain.** Uploads bypass the server and go
  straight to the bucket via a presigned URL, so without this every upload fails
  in the browser with an opaque CORS error.

> **Update [`next.config.ts`](../next.config.ts) to match your bucket.**
> `next/image` only loads images from allowlisted hostnames. Change the
> `remotePatterns` hostname from `lms-alhamzeh.fly.storage.tigris.dev` to your
> own, commit, and redeploy. Miss this and every image renders blank with no
> error in the UI.

## 3. Verify an email domain

In Resend, add your domain and complete DNS verification, then create an API key.

Your `RESEND_FROM_EMAIL` must use that verified domain. The shared
`onboarding@resend.dev` address **only delivers to the Resend account owner** —
in production nobody else would ever receive a sign-in code, and Resend still
reports success, so nothing shows up in your logs.

## 4. Create the GitHub OAuth app

Register a new OAuth app with the callback URL set to exactly:

```
https://your-domain.com/api/auth/callback/github
```

One app holds one callback URL, so keep a separate app for local development.

## 5. Deploy to Vercel

1. Import the repository at <https://vercel.com/new>. Next.js is auto-detected.
2. Add every variable from [`.env.example`](../.env.example) under
   **Settings → Environment Variables**, scoped to Production.
   - `BETTER_AUTH_URL` is your real production URL, no trailing slash.
   - `BETTER_AUTH_SECRET` must differ from your development value.
   - Leave `SKIP_ENV_VALIDATION` unset.
3. Deploy.

The build does not need database access — all dynamic routes are rendered on
demand — so a build failure here is a genuine code or configuration problem.

If the build fails with a message about a missing environment variable, that is
`lib/env.ts` doing its job. Add the variable and redeploy.

## 6. Create the schema

From a machine with `DATABASE_URL` pointing at production:

```bash
pnpm prisma:deploy     # prisma migrate deploy
```

This applies `prisma/migrations/0_init`. Do not use `prisma db push` against
production — it applies changes with no history or review.

**If the database already has tables** created previously with `db push`,
baseline it once before the first deploy, or the migration will fail trying to
create tables that already exist:

```bash
pnpm exec prisma migrate resolve --applied 0_init
```

## 7. Connect the Stripe webhook

Only possible once you have the deployed URL.

1. In Stripe → Developers → Webhooks, add an endpoint:
   `https://your-domain.com/api/webhook/stripe`
2. Subscribe it to **`checkout.session.completed`**.
3. Copy that endpoint's signing secret into `STRIPE_WEBHOOK_SECRET` in Vercel.
4. **Redeploy** so the new value is picked up.

The webhook is what activates an enrollment after payment. Until this is right,
customers are charged and never get access, while checkout itself looks fine.

## 8. Create your first admin

Sign in through the app so the user record exists, then promote it:

```sql
UPDATE "user" SET role = 'admin' WHERE email = 'you@your-domain.com';
```

Everything under `/admin` redirects to `/login` until a user has this role.

---

## Post-deployment checks

Work through these in order. Several failures are silent, so an untested
deployment can look healthy while being broken.

- [ ] Home page and course listing load
- [ ] **Email sign-in delivers a code to an address you do not own** — catches an
      unverified Resend domain
- [ ] GitHub sign-in completes — catches a callback URL mismatch
- [ ] `/admin` redirects to `/login` when signed out
- [ ] `/admin` loads for your admin user
- [ ] Course images render — catches a stale `next.config.ts` hostname
- [ ] Uploading a course image succeeds — catches missing bucket CORS
- [ ] Lesson video plays
- [ ] A PDF material opens for an enrolled student
- [ ] **A test purchase moves the enrollment from Pending to Active** — the single
      most important check; a failure means the webhook secret is wrong
- [ ] **The Arcjet dashboard shows traffic** — an invalid key silently disables
      rate limiting and bot protection

---

## Troubleshooting

**"Error sending email" on sign-in.** Almost always `BETTER_AUTH_URL` not
matching the actual origin. The server log shows the real cause
(`Invalid origin: …`). Also check the Resend domain is verified.

**Images are blank with no error.** The bucket hostname is not in
`next.config.ts` `remotePatterns`.

**Uploads fail in the browser.** Bucket CORS does not allow `PUT` from your
domain.

**Customer charged but has no access.** The webhook is not reaching the app or
the signing secret is wrong. Check Stripe → Webhooks for delivery attempts and
their responses.

**Everything 500s after deploy.** Usually `DATABASE_URL` — wrong credentials,
missing `sslmode=require`, or an exhausted connection limit.

**Build fails on a missing variable.** Intentional. Add it and redeploy.
