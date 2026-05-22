# Speed Global Trade

## Live Chat Setup for Site Owner

1. Go to [https://www.tawk.to](https://www.tawk.to) and create or open the client's Tawk.to account.
2. In Tawk.to, open `Administration -> Channels -> Chat Widget` and copy the `propertyId` and `widgetId`.
3. Create or update `.env.local` in the project root and set:

```bash
NEXT_PUBLIC_TAWK_PROPERTY_ID=property_id_from_tawk
NEXT_PUBLIC_TAWK_WIDGET_ID=widget_id_from_tawk
SGT_SESSION_SECRET=replace-this-with-a-long-random-secret
APP_BASE_URL=https://speedglobal.trade
NEXT_PUBLIC_APP_BASE_URL=https://speedglobal.trade
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=Speed Global Trade <no-reply@speedglobal.trade>
NEXT_PUBLIC_STRIPE_SUCCESS_URL=https://speedglobal.trade/success
NEXT_PUBLIC_STRIPE_CANCEL_URL=https://speedglobal.trade/cancel
```

4. `RESEND_API_KEY` must come from your Resend dashboard, and `RESEND_FROM_EMAIL` should use a sender identity you have verified in Resend for production delivery.
5. `APP_BASE_URL` must match the deployed site origin so verification links return users to the correct environment.
6. After deployment, log into the Tawk.to dashboard or app with the same account to start receiving and replying to website chats.

Premium investment platform built with Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, React Hook Form + Zod, Recharts, Lucide icons, `next-intl`, Zustand, and OpenNext for Cloudflare Workers.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Copy `.env.example` to `.env.local` and provide your values before production use.

## D1 Database

Apply the schema migrations against your bound D1 database:

```bash
npm run db:migrate:local
npm run db:migrate:remote
```

Remote D1 migrations require Wrangler authentication. In non-interactive environments, set `CLOUDFLARE_API_TOKEN` before running `npm run db:migrate:remote`.

Regenerate Cloudflare binding types whenever bindings change:

```bash
npm run cf:typegen
```

## Email Verification

Authentication now requires a secure email verification link on both signup and login.

- `APP_BASE_URL` should point to the deployed app origin used inside email links.
- `RESEND_API_KEY` must be a valid Resend API key.
- `RESEND_FROM_EMAIL` should use a sender/domain verified in Resend for production inbox delivery.
- If `RESEND_FROM_EMAIL` is omitted during local development, the app falls back to `Speed Global Trade <no-reply@speedglobal.trade>`.

## Build

For local and Cloudflare-compatible builds:

```bash
npm run build
```

This runs:

```bash
next build
npx @opennextjs/cloudflare@latest build --skipNextBuild
```

## Features

- Five-language marketing experience with `next-intl`: English, Simplified Chinese, Spanish, Arabic, and Hindi
- Locale-aware auth and dashboard routes such as `/en/dashboard` and `/es/login`
- Tawk.to live chat integration via `NEXT_PUBLIC_TAWK_PROPERTY_ID` and `NEXT_PUBLIC_TAWK_WIDGET_ID`
- Deposit-first business logic with an empty onboarding dashboard for new users
- Protected dashboard routes backed by signed session cookies and D1-backed user records
- Password + email verification flow powered by Resend
- Premium marketing pages, testimonials, sponsor marquee, activity feed, and upgraded footer
- D1 persistence for users, verification tokens, transactions, allocations, and portfolio snapshots
