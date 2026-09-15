# Configuration reference

Every variable below is **required**. The app validates them at startup in
[`lib/env.ts`](../lib/env.ts) and refuses to boot if any is missing or
malformed — a deliberate choice, so a misconfigured deployment fails loudly
at start rather than silently at the first payment or upload.

Copy [`.env.example`](../.env.example) to `.env` for local work. For production,
set them in your host's dashboard. Never commit a filled-in `.env`.

---

## Database

### `DATABASE_URL`
PostgreSQL connection string. Any Postgres works; managed options include Neon,
Supabase, Railway and AWS RDS.

Most hosted providers require TLS — append `?sslmode=require` if connections are
refused. Serverless platforms open a connection per function instance, so use
the provider's **pooled** connection string if one is offered.

*If wrong:* the app starts but every page touching data returns a 500.

---

## Authentication

### `BETTER_AUTH_SECRET`
Signs session cookies. Minimum 32 characters. Generate with `openssl rand -base64 32`.

Use a different value in production than in development. Changing it invalidates
every existing session, logging all users out.

### `BETTER_AUTH_URL`
The full origin the app is served from, with no trailing slash
(`https://lms.example.com`).

**This must match the real URL exactly.** better-auth rejects requests from any
other origin, and the rejection surfaces in the UI only as a generic
"Error sending email" — the real reason (`Invalid origin`) appears solely in the
server log. If sign-in fails for no apparent reason, check this first.

It is also used as the base for Stripe's success and cancel redirect URLs.

### `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET`
GitHub OAuth app credentials, from
<https://github.com/settings/developers> → New OAuth App.

The Authorization callback URL must be exactly:

```
<BETTER_AUTH_URL>/api/auth/callback/github
```

A GitHub OAuth app has one callback URL, so register a **separate app** for
production and for local development.

*If wrong:* "Sign in with GitHub" fails; email sign-in still works.

---

## Email

### `RESEND_API_KEY`
From <https://resend.com/api-keys>. Must start with `re_`.

### `RESEND_FROM_EMAIL`
The From address for sign-in codes, e.g. `Al-Hamzeh LMS <noreply@your-domain.com>`.

**It must be on a domain verified at <https://resend.com/domains>.**

Resend's shared `onboarding@resend.dev` address only delivers to the Resend
account owner. Leaving it in production means nobody else ever receives a
sign-in code — and because Resend still reports the send as successful, nothing
appears in the logs. Email sign-in simply stops working, silently. Verify a
domain before going live.

---

## Security

### `ARCJET_KEY`
Site key from <https://app.arcjet.com>. Powers rate limiting and bot protection
on authentication, uploads and enrollment.

**An invalid key does not raise a visible error.** Arcjet returns an `ERROR`
decision, which the app treats as "allow", so protection is silently disabled
while the app appears healthy. After deploying, confirm the Arcjet dashboard
shows traffic.

---

## Storage

Course images, lesson videos and PDF materials live in an S3-compatible bucket.
The app is configured for Tigris; any S3-compatible provider works if you adjust
the endpoint.

### `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`
Access key pair for the bucket. Passed explicitly to the S3 client, so a missing
value fails at startup rather than on the first upload.

### `AWS_ENDPOINT_URL_S3`
Storage endpoint, e.g. `https://fly.storage.tigris.dev`.

### `AWS_REGION`
Region. Tigris uses `auto`.

### `NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES`
Bucket name. Exposed to the browser, since image and video URLs are built
client-side.

The bucket needs:
- **public read** for images and videos, which are fetched directly by the browser
- **CORS allowing `PUT`** from your domain, since uploads go straight to the
  bucket through a presigned URL

> **Changing this also requires editing [`next.config.ts`](../next.config.ts).**
> `next/image` only loads images from allowlisted hostnames. Update the
> `remotePatterns` hostname to match the new bucket or every image silently
> fails to render.

---

## Payments

### `STRIPE_SECRET_KEY`
From <https://dashboard.stripe.com/apikeys>. `sk_test_…` while testing,
`sk_live_…` in production.

Each course row stores a `stripePriceId`, which must reference a Price that
exists in the **same** Stripe account and mode. Courses created against test
mode will not check out against a live key.

### `STRIPE_WEBHOOK_SECRET`
Signing secret for your webhook endpoint, from
<https://dashboard.stripe.com/webhooks>. Must start with `whsec_`.

Add an endpoint pointing at `<BETTER_AUTH_URL>/api/webhook/stripe`, subscribed
to `checkout.session.completed`, then copy that endpoint's secret.

**This is the single most consequential value to get right.** The webhook is
what flips an enrollment from `Pending` to `Active`. With a wrong secret every
webhook is rejected, so customers are charged and never receive access, while
the checkout flow itself looks perfectly healthy.

Each endpoint has its own secret, so the Stripe CLI's local secret differs from
the production one.

---

## Build only

### `SKIP_ENV_VALIDATION`
Set to `"true"` to bypass validation during a build with no secrets available,
such as a Docker image build. **Never set it at runtime** — it disables the
checks that catch a misconfigured deployment.
