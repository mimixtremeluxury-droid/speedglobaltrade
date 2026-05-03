# Speed Global Trade

## Live Chat Setup for Site Owner

1. Go to [https://crisp.chat](https://crisp.chat) and create a free Crisp account.
2. In the Crisp dashboard, open your website settings and copy the **Website ID**.
3. Create or update `.env.local` in the project root and set:

```bash
NEXT_PUBLIC_CRISP_WEBSITE_ID=YOUR_CRISP_WEBSITE_ID
SGT_SESSION_SECRET=replace-this-with-a-long-random-secret
APP_BASE_URL=https://speedglobaltrade.mimixtremeluxury.workers.dev
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=Speed Global Trade <no-reply@yourdomain.com>
```

4. Replace `YOUR_CRISP_WEBSITE_ID` with the real Website ID from Crisp.
5. Download the Crisp mobile or desktop app from Crisp or your app store.
6. Sign in to the Crisp app with the same account to start receiving and replying to website chats.

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
- `RESEND_FROM_EMAIL` must use a sender/domain verified in Resend.

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
- Crisp chat integration via `NEXT_PUBLIC_CRISP_WEBSITE_ID`
- Deposit-first business logic with an empty onboarding dashboard for new users
- Protected dashboard routes backed by signed session cookies and D1-backed user records
- Password + email verification flow powered by Resend
- Premium marketing pages, testimonials, sponsor marquee, activity feed, and upgraded footer
- D1 persistence for users, verification tokens, transactions, allocations, and portfolio snapshots
