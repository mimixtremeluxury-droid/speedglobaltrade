# Speed Global Trade

## Live Chat Setup for Site Owner

1. Go to [https://crisp.chat](https://crisp.chat) and create a free Crisp account.
2. In the Crisp dashboard, open your website settings and copy the **Website ID**.
3. Create or update `.env.local` in the project root and set:

```bash
NEXT_PUBLIC_CRISP_WEBSITE_ID=YOUR_CRISP_WEBSITE_ID
SGT_SESSION_SECRET=replace-this-with-a-long-random-secret
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
- Deposit-first mock business logic with an empty onboarding dashboard for new users
- Protected dashboard routes backed by signed session cookies
- Premium marketing pages, testimonials, sponsor marquee, activity feed, and upgraded footer
- Mock local persistence for users, transactions, allocations, and settings

## Demo Credentials

- Email: `demo@speedglobaltrade.com`
- Password: `Demo@12345`

Use **Demo Login** to explore a pre-seeded active account.
