# Speed Global Trade

## Live Chat Setup for Site Owner

1. Go to [https://www.smartsupp.com](https://www.smartsupp.com) and create a Smartsupp account, or keep using the provisioned widget key already wired into this repo.
2. In Smartsupp, confirm the website installation and install the Smartsupp mobile or desktop app so replies reach the owner in real time.
3. Create or update `.env.local` in the project root and set:

```bash
NEXT_PUBLIC_SMARTSUPP_KEY=bf325982577c378cebb163441ac5dea0dbe70a88
SGT_SESSION_SECRET=replace-this-with-a-long-random-secret
APP_BASE_URL=https://speedglobaltrade.mimixtremeluxury.workers.dev
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=Speed Global Trade <no-reply@yourdomain.com>
```

4. `RESEND_API_KEY` must come from your Resend dashboard, and `RESEND_FROM_EMAIL` should use a sender identity you have verified in Resend for production delivery.
5. `APP_BASE_URL` must match the deployed site origin so verification links return users to the correct environment.
6. After deployment, log into the Smartsupp app with the same account to start receiving and replying to website chats.

### Smartsupp 403 Checklist

If the browser console shows a `403` from `https://www.smartsuppchat.com/loader.js`, the app code is already falling back safely, but the Smartsupp account still needs configuration:

1. In Smartsupp, open `Settings -> General -> Domain whitelist` and add your live host exactly as a domain, for example `speedglobaltrade.mimixtremeluxury.workers.dev`.
2. Do not include protocol or path in the whitelist entry. Smartsupp's help center shows valid examples like `website.com`, `www.website.com`, or `*.website.com`.
3. In `Settings -> Chat box -> Options`, confirm the chat box is not fully hidden and not hidden while offline.
4. Make sure the current visitor or office IP is not blocked in Smartsupp.
5. If you later add a CSP, allow Smartsupp domains including `smartsupp.com`, `smartsuppchat.com`, `smartsuppcdn.com`, and the websocket/connect domains documented by Smartsupp.

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
- If `RESEND_FROM_EMAIL` is omitted during local development, the app falls back to `Speed Global Trade <onboarding@resend.dev>`.

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
- Smartsupp live chat integration via `NEXT_PUBLIC_SMARTSUPP_KEY`
- Deposit-first business logic with an empty onboarding dashboard for new users
- Protected dashboard routes backed by signed session cookies and D1-backed user records
- Password + email verification flow powered by Resend
- Premium marketing pages, testimonials, sponsor marquee, activity feed, and upgraded footer
- D1 persistence for users, verification tokens, transactions, allocations, and portfolio snapshots
