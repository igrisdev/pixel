<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Repo reality check
- This is a single-package Next.js 16 app (not a monorepo) using pnpm (`pnpm-lock.yaml` present).
- The committed `README.md` is mostly create-next-app boilerplate; trust scripts/config/code over README instructions.
- Current direction: move data/auth flows to real Next.js API routes backed by Prisma + PostgreSQL, using a repository pattern.

## Verified commands
- Install deps: `pnpm install`
- Dev server: `pnpm dev`
- Lint: `pnpm lint`
- Build: `pnpm build`
- Start prod build: `pnpm start`
- Start PostgreSQL (Docker): `docker-compose up -d`
- Prisma migration: `npx prisma migrate dev`
- Prisma Studio: `npx prisma studio`
- Prisma seed: `npx prisma db seed`
- There is no dedicated test script configured in `package.json`.

## App structure and entrypoints
- App Router source lives in `src/app` (root routes: `/`, `/login`, `/dashboard`, `/search`, `/project/[id]`, `/profile/[id]`).
- Global shell is in `src/app/layout.tsx` and always renders `Navbar` + `Footer` around page content.
- Dashboard/admin functionality is componentized under `src/components/dashboard/*.tsx`.

### Dashboard Routes (v2 - reorganizado con rutas separadas + Layout común)
- `/dashboard` - Redirect según rol (Admin → /dashboard/users, Member → /dashboard/profile)
- `/dashboard/layout.tsx` - Layout común con sidebar (usa Link para navegación)
- `/dashboard/users` - Gestión de Usuarios (Admin)
- `/dashboard/approvals` - Aprobaciones Pendientes (Admin)
- `/dashboard/audits` - Auditoría Global (Admin)
- `/dashboard/competencies` - Catálogo Competencias (Admin)
- `/dashboard/profile` - Mi Perfil (Admin + Member)
- `/dashboard/projects` - Mis Proyectos (Admin + Member)

## Domain context
- This app manages member portfolios: macro projects, academic/professional products, participations, and competencies.
- Core entities reflected in types/schema: `Member`, `Project`, `AcademicProduct`, `Participation`, `Competency`, `ProfessionalLink`.

## API + Prisma migration rules (current priority)
- Do not add new mock-only data flows for features that touch persistence; implement through Next.js API routes + Prisma instead.
- Use repository abstraction in `src/services/api.ts` (or adjacent service modules) to call API routes from frontend state/actions.
- Prefer Server Components by default; use `"use client"` only where React state/effects or browser APIs are required.

## Prisma and DB status
- Prisma is configured (`prisma.config.ts`, `prisma/schema.prisma`) with **PostgreSQL** provider.
- `DATABASE_URL` configured in `.env`.
- Local PostgreSQL in `docker-compose.yml` (`pixel_db` on port `5432`).
- Uses Prisma 7 with `@prisma/adapter-pg` driver adapter.

## Coding conventions (team-specific)
- Naming language split: types/interfaces/variables/functions/DB models in English; UI copy and comments in Spanish.
- API routes should wrap handler logic in `try/catch` and return JSON errors with `NextResponse.json({ error: "..." }, { status: 500 })`.
- Keep strict typing; avoid `any`; prefer shared app types and Prisma types when working with DB data.
- Use `@/...` import aliases.
- Keep existing visual language with Tailwind utilities (including dashed borders, neutral surfaces, and status badges).

## Lint baseline (before adding new work)
- `pnpm lint` currently fails with existing repo errors (not introduced by your change), including `react-hooks/set-state-in-effect` and `@typescript-eslint/no-explicit-any` in dashboard/search components.
- Treat those as pre-existing unless your task is specifically to fix lint debt.

## Seed de Base de Datos
- Seed script: `prisma/seed.ts`
- Ejecutar: `npx prisma db seed`
- Datos seeded: 32 competencias, 9 miembros, 39 relaciones miembro-competencia, 1 enlace profesional, 2 proyectos, 2 productos académicos, 4 participaciones
- Contraseñas en texto plano: admin123 (admin), est123 (miembros)
- Credenciales de prueba:
  - Admin: admin@unimayor.edu.co / admin123
  - Miembro: johan@unimayor.edu.co / est123

## API Routes
- `/api/auth/login` - Autenticación de usuarios (POST)
- `/api/members` - CRUD de miembros (GET, POST)
- `/api/members/[id]` - Miembro individual (GET, PUT, DELETE)
- `/api/projects` - CRUD de proyectos (GET, POST)
- `/api/projects/[id]` - Proyecto individual (GET, PUT, DELETE)
- `/api/competencies` - CRUD de competencias (GET, POST)
- `/api/competencies/[id]` - Competencia individual (GET, PUT, DELETE)

## Autenticación
- Login con comparación de contraseña en texto plano
- Almacena usuario en Zustand store con persistencia
- Member completo (incluyendo competencias y enlaces) disponible en `currentMember`

## UI/UX Patterns
- Variables de estado reactivo: para datos que GSAP necesita rastrear (`metrics`, `studentGrid`, `proyectosGrid`)
- Skeleton loading: usar variable ternaria con `isLoadingData` para mostrar skeletons mientras cargan datos
- Variables para grids: evitar errores de sintaxis JSX con operadores ternarios usando variables predefinidas (`studentGrid`, `proyectosGrid`)
- Envolver secciones ternarias en `<div>` adicional para evitar errores de parsing

## Historial de Cambios Recientes
- page.tsx: agregada sección "Proyectos Tecnológicos" con skeleton de 6 cards mientras carga
- page.tsx: métricas de la página de inicio muestran datos reales de DB (Proyectos DT, Integrantes, Egresados)
- page.tsx: "Talento Destacado" muestra 8 skeleton cards mientras carga
- Fix build error: corregido ternario huérfano en línea 348 que causaba error de sintaxis
- Migración completa MySQL → PostgreSQL:
  - schema.prisma: provider mysql → postgresql
  - package.json: @prisma/adapter-mariadb + mariadb → @prisma/adapter-pg + pg
  - src/lib/prisma.ts: PrismaMariaDb → PrismaPg
  - prisma/seed.ts: Actualizado para PostgreSQL
  - docker-compose.yml: mysql:8.0 → postgres:16
  - .env: DATABASE_URL actualizada
- Prisma 7 migration:
  - schema.prisma: provider prisma-client-js → prisma-client con output
  - generated client movido a src/generated/client
  - tsconfig.json: excluye prisma/seed.ts del build
  - Import paths actualizados de @prisma/client → @/generated/client
  - Index barrel file creado para exports

## Mejores Prácticas Implementadas (v0.2.0)
- Corregido error crítico: setState dentro de useEffect de metrics →useMemo derivados
- Nuevo hook useInitialData.ts: carga datos reutilizable con guard para no recargar si ya existen
- Nuevos componentes skeleton reutilizables: MemberSkeleton, ProjectSkeleton, EscalatorSkeleton
- useMemo aplicado para datos derivados en page.tsx (metrics, activeStudents, proyectosActivos)
- Imports no usados limpiados

## Deploy

### Pending: deployment

#### Opción 1: Vercel + Neon (推荐)
- Hosting: Vercel (gratis para proyectos personales)
- DB: Neon (gratis, 0.5GB PostgreSQL serverless)

#### Opción 2: Vercel + PlanetScale
- Hosting: Vercel
- DB: PlanetScale (gratis, 5GB MySQL serverless)

#### Opción 3: Fly.io (todo-in-one)
- Hosting + DB todo en Fly.io con PostgreSQL

### Pasos para deployment (Vercel + Neon):
1. Crear cuenta en neon.tech
2. Crear nuevo proyecto PostgreSQL (pixel_db)
3. Copiar DATABASE_URL de Neon
4. En Vercel Dashboard → Settings → Environment Variables → agregar DATABASE_URL
5. Desde PC local:
   - Cambiar DATABASE_URL en .env a la de Neon
   - `npx prisma migrate deploy`
   - `npx prisma db seed`

### Notas importantes
- docker-compose.yml se queda para desarrollo local
- Solo cambia DATABASE_URL para producción
- No hay cambios en código entre local y producción (solo env)
