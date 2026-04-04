# TrustLoop

TrustLoop is a production-ready agreement and accountability tracker built with Next.js 14, TypeScript, Tailwind CSS, Prisma, Supabase Auth, and Supabase Realtime.

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- Supabase PostgreSQL
- Supabase Auth
- Supabase Realtime
- TanStack Query
- Zustand
- Framer Motion
- Lucide Icons

## Features

- Email/password signup and login with Supabase Auth
- Protected dashboard and agreement routes
- Agreement creation with participants, due dates, and obligations
- Realtime dashboard and agreement updates
- Activity timeline for every agreement
- Trust score adjustments based on obligation outcomes
- Responsive SaaS-style UI with animated cards and modal workflows

## Environment

Create `.env.local` from `.env.example`:

```bash
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
```

## Setup

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

## Supabase Notes

- Make sure Supabase Auth email/password is enabled.
- Enable Realtime for `agreements`, `agreement_participants`, `obligations`, and `activity_logs`.
- Use the Supabase Auth user ID as the `users.id` primary key in Prisma-backed data.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run prisma:generate
npm run prisma:migrate
```
