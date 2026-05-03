<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Repo reality check
- This is a single-package Next.js 16 app (not a monorepo) using pnpm (`pnpm-lock.yaml` present).
- The committed `README.md` is mostly create-next-app boilerplate; trust scripts/config/code over README instructions.
- Current direction: move data/auth flows to real Next.js API routes backed by Prisma + MySQL (Docker), using a repository pattern.

## Verified commands
- Install deps: `pnpm install`
- Dev server: `pnpm dev`
- Lint: `pnpm lint`
- Build: `pnpm build`
- Start prod build: `pnpm start`
- Start MySQL (Docker): `docker-compose up -d`
- Prisma migration: `npx prisma migrate dev`
- Prisma Studio: `npx prisma studio`
- There is no dedicated test script configured in `package.json`.

## App structure and entrypoints
- App Router source lives in `src/app` (root routes: `/`, `/login`, `/dashboard`, `/search`, `/project/[id]`, `/profile/[id]`).
- Global shell is in `src/app/layout.tsx` and always renders `Navbar` + `Footer` around page content.
- Dashboard/admin functionality is componentized under `src/components/dashboard/*.tsx`.

## Domain context
- This app manages member portfolios: macro projects, academic/professional products, participations, and competencies.
- Core entities reflected in types/schema: `Member`, `Project`, `AcademicProduct`, `Participation`, `Competency`, `ProfessionalLink`.

## API + Prisma migration rules (current priority)
- Do not add new mock-only data flows for features that touch persistence; implement through Next.js API routes + Prisma instead.
- Use repository abstraction in `src/services/api.ts` (or adjacent service modules) to call API routes from frontend state/actions.
- Prefer Server Components by default; use `"use client"` only where React state/effects or browser APIs are required.

## Prisma and DB status
- Prisma is configured (`prisma.config.ts`, `prisma/schema.prisma`) with MySQL provider and `DATABASE_URL` from env.
- Local MySQL helper exists in `docker-compose.yml` (`pixel_db` on `3306`).

## Coding conventions (team-specific)
- Naming language split: types/interfaces/variables/functions/DB models in English; UI copy and comments in Spanish.
- API routes should wrap handler logic in `try/catch` and return JSON errors with `NextResponse.json({ error: "..." }, { status: 500 })`.
- Keep strict typing; avoid `any`; prefer shared app types and Prisma types when working with DB data.
- Use `@/...` import aliases.
- Keep existing visual language with Tailwind utilities (including dashed borders, neutral surfaces, and status badges).

## Lint baseline (before adding new work)
- `pnpm lint` currently fails with existing repo errors (not introduced by your change), including `react-hooks/set-state-in-effect` and `@typescript-eslint/no-explicit-any` in dashboard/search components.
- Treat those as pre-existing unless your task is specifically to fix lint debt.
