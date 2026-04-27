# Speed Global Trade

Premium investment platform built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, React Hook Form + Zod, Recharts, and Lucide icons.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Cloudflare Workers Note

This project currently runs on Next.js 14.2.x. Some OpenNext Cloudflare flows require Next.js 15+ unless you pass the unsupported-version override flag.

For Cloudflare Workers Builds, use this build command:

```bash
npm run build
```

The repo build now does two steps:

```bash
next build
npx @opennextjs/cloudflare@latest build --dangerouslyUseUnsupportedNextVersion --skipNextBuild
```

If you prefer strict compatibility in the future, migrate to Next.js 15.5.15+ and remove the flag.

## Features

- Marketing pages: home, plans, about, contact
- Mock auth: signup/login + demo login (localStorage persistence)
- Middleware-protected dashboard routes
- Dashboard modules: overview, deposit, withdraw, investments, transactions, settings
- Recharts pie chart for active investments
- Form validation using React Hook Form + Zod
- Toasts, loading skeletons, responsive glassmorphism UI

## Demo Credentials

- Email: `demo@speedglobaltrade.com`
- Password: `Demo@12345`

Use **Demo Login** to auto-create and sign in with seeded account data.
