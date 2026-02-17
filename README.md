# goals-app

Monarch-inspired goals + habits tracker (single-player v1).

## Stack

- Next.js (App Router) + TypeScript
- Tailwind + shadcn/ui
- Postgres + Prisma
- Auth.js / NextAuth with Google + Microsoft Entra ID

## Getting started

```bash
docker compose up -d
cp .env.example .env
npm i
npx prisma migrate dev
# Optional sample data (requires SEED_USER_EMAIL)
SEED_USER_EMAIL="you@example.com" npx prisma db seed
npm run dev
```

## Auth setup

Create OAuth apps and set:

- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- `AZURE_AD_CLIENT_ID` / `AZURE_AD_CLIENT_SECRET` / `AZURE_AD_TENANT_ID`

## Optional seed data

Set `SEED_USER_EMAIL` to your OAuth email to attach sample cycles/goals:

```bash
SEED_USER_EMAIL="you@example.com" npx prisma db seed
```
