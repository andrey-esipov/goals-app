# goals-app

Monarch-inspired goals + habits tracker (single-player v1).

## Stack

- Next.js (App Router) + TypeScript
- Tailwind + shadcn/ui
- Postgres + Prisma
- Auth.js / NextAuth with Google + Microsoft Entra ID

## Getting started

```bash
cp .env.example .env
npm i
npx prisma generate
npm run dev
```

## Auth setup

Create OAuth apps and set:

- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- `AZURE_AD_CLIENT_ID` / `AZURE_AD_CLIENT_SECRET` / `AZURE_AD_TENANT_ID`
