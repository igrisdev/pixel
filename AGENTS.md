<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any depreciation notices.
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
- Prisma local reset (recovery): `npx prisma db push --force-reset`
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
- **All `<button>` elements must include `cursor-pointer` class** in Tailwind CSS styling.

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
  - Miembro: jmalvarez@unimayor.edu.co / est123

## Recuperación local de acceso admin
- Incidente resuelto: en local hubo un cambio accidental de contraseña de admin.
- Flujo recomendado para recuperar acceso:
  1. `docker-compose up -d`
  2. `npx prisma db push --force-reset`
  3. `npx prisma db seed`
- Este flujo **borra datos locales** y restaura las credenciales del seed vigente:
  - Admin: `admin@unimayor.edu.co / admin123`
  - Miembro: `jmalvarez@unimayor.edu.co / est123`

## API Routes
- `/api/auth/login` - Autenticación de usuarios (POST)
- `/api/members` - CRUD de miembros (GET, POST)
- `/api/members/[id]` - Miembro individual (GET, PUT, DELETE)
- `/api/members/[id]/links` - CRUD de enlaces profesionales (POST, PUT, DELETE con ?linkId=X)
- `/api/members/[id]/competencies` - Sincronizar competencias del miembro (PUT)
- `/api/projects` - CRUD de proyectos (GET, POST)
- `/api/projects/[id]` - Proyecto individual (GET, PUT, DELETE)
- `/api/competencies` - CRUD de competencias (GET, POST)
- `/api/competencies/[id]` - Competencia individual (GET, PUT, DELETE)
- `/api/projects/participations` - Buscar proyectos por participación (GET)

## Autenticación
- Login con hashing/verificación de contraseña usando `bcryptjs`
- Almacena usuario en Zustand store con persistencia
- Member completo (incluyendo competencias y enlaces) disponible en `currentMember`

## UI/UX Patterns
- Variables de estado reactivo: para datos que GSAP necesita rastrear (`metrics`, `studentGrid`, `proyectosGrid`)
- Skeleton loading: usar variable ternaria con `isLoadingData` para mostrar skeletons mientras cargan datos
- Variables para grids: evitar errores de sintaxis JSX con operadores ternarios usando variables predefinidas (`studentGrid`, `proyectosGrid`)
- Envolver secciones ternarias en `<div>` adicional para evitar errores de parsing

## Nuevas Funcionalidades
- **"Mis Participaciones"**: Nueva página en el dashboard que permite a los usuarios ver los proyectos en los que participan
- **API de Participaciones**: Nuevo endpoint para buscar proyectos por participación de miembros

## Fixes Implementados
- **Validación de URLs opcionales**: Corregida la validación de campos URL que eran opcionales en proyectos y miembros
- **Aprobación de proyectos**: Corregido bug donde aprobar proyectos en Admin borraba campos existentes
- **Modal de proyectos**: Cierre automático del modal al actualizar proyectos desde el dashboard

## Historial de Cambios Recientes
- **Seguridad**: Implementado bcryptjs para hashing, actualizado Next.js a 16.2.6, agregada verificación de rol en páginas admin, eliminados console.logs DEBUG y credenciales demo del login
- **Hardening de plataforma**: validaciones Zod centralizadas, guards admin en rutas de dashboard, toasts en CRUDs y build estable
- **IntegranteProyectosCRUD**: Fix type errors - type assertions para Participation y AcademicProduct
- **IntegrantePerfilCRUD**: Fix estado links - `hasLinkChanges` ahora filtra IDs optimistas negativos, `originalLinks` se sincroniza en onSave del modal, badge "Sin guardar" solo aparece con cambios reales
- **IntegrantePerfilCRUD**: Alerta de confirmación (`window.confirm()`) antes de eliminar enlace
- **IntegrantePerfilCRUD**: CRUD de links/competencies ahora llama `loadMembers()` tras éxito → cambios reflejados en la UI sin recargar página
- **EditLinkModal**: Componente modal reutilizable para editar enlaces profesionales en `/dashboard/profile`
- page.tsx: agregada sección "Proyectos Tecnológicos" con skeleton de 6 cards mientras carga
- page.tsx: métricas de la página de inicio muestran datos reales de DB (Proyectos DT, Integrantes, Egresados)
- page.tsx: "Talento Destacado" muestra 8 skeleton cards mientras carga
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

## Deployment (Vercel + Neon)
- Hosting: Vercel (deploy OK)
- DB: Neon (neondb) - migraciones aplicadas
- Seed: Aplicado correctamente
- DATABASE_URL configurada en Vercel

## Deploy

### Pasos para seed en producción
1. Corregir ruta en prisma/seed.ts (cambiar a ruta relativa correcta)
2. Ejecutar: npx prisma db seed

### Pasos para deployment (Vercel + Neon):
1. Crear cuenta en neon.tech
2. Crear nuevo proyecto PostgreSQL (pixel_db)
3. Copiar DATABASE_URL de Neon
4. En Vercel Dashboard → Settings → Environment Variables → agregar DATABASE_URL
5. Desde PC local:
   - Cambiar DATABASE_URL en .env a la de Neon
   - `npx prisma migrate deploy`
   - `npx prisma db seed`
