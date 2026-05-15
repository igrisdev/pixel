# Portfolio Pixel

Sistema de gestión de portafolios para estudiantes universitarios — permite a miembros administrar proyectos, competencias y enlaces profesionales.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
- **Estado**: Zustand + persist middleware
- **Backend**: Next.js API Routes
- **ORM**: Prisma 7 con PostgreSQL (Neon serverless o Docker local)
- **Deploy**: Vercel

## Estructura de Carpetas Clave

```
src/
├── app/                    # App Router (rutas páginas)
│   ├── page.tsx            # Landing page
│   ├── login/              # Autenticación
│   ├── dashboard/          # Dashboard (protegido)
│   │   ├── users/          # Gestión usuarios (Admin)
│   │   ├── approvals/      # Aprobaciones (Admin)
│   │   ├── audits/         # Auditoría (Admin)
│   │   ├── competencies/   # Catálogo competencias (Admin)
│   │   ├── profile/        # Mi perfil (Admin + Member)
│   │   └── projects/       # Mis proyectos (Admin + Member)
│   ├── search/             # Búsqueda de integrantes
│   ├── project/[id]/       # Detalle de proyecto
│   └── profile/[id]/       # Perfil público de miembro
├── components/
│   └── dashboard/          # Componentes del dashboard
├── services/               # API client (api.ts)
├── types/                  # Tipos TypeScript
└── lib/                    # Utilidades (prisma client)
```

## Rutas Principales

### Públicas
- `/` — Landing con métricas, proyectos destacados, talento
- `/login` — Autenticación
- `/search` — Búsqueda de integrantes
- `/project/[id]` — Detalle de proyecto público
- `/profile/[id]` — Perfil público de miembro

### Dashboard (protegidas)
- `/dashboard` — Redirect según rol
- `/dashboard/users` — Gestión usuarios (Admin)
- `/dashboard/approvals` — Aprobaciones (Admin)
- `/dashboard/audits` — Auditoría global (Admin)
- `/dashboard/competencies` — Catálogo competencias (Admin)
- `/dashboard/profile` — Mi perfil (Admin + Member)
- `/dashboard/projects` — Mis proyectos (Admin + Member)

## Comandos de Desarrollo

```bash
# Instalar dependencias
pnpm install

# Servidor desarrollo
pnpm dev

# Build producción
pnpm build

# Iniciar producción
pnpm start

# Linting
pnpm lint

# PostgreSQL local (Docker)
docker-compose up -d

# Aplicar migraciones
npx prisma migrate dev

# Poblar base de datos con datos de prueba
npx prisma db seed

# Generar cliente Prisma (si es necesario)
npx prisma generate
```

## Recuperación de acceso admin (entorno local)

Si en entorno local el acceso de admin se rompe (por ejemplo, por un cambio accidental de contraseña), la vía recomendada es resetear la base local y re-seedear los datos.

```bash
# 1) Levantar PostgreSQL local
docker-compose up -d

# 2) Resetear esquema/datos locales y sincronizar con schema.prisma
npx prisma db push --force-reset

# 3) Reinsertar datos seed
npx prisma db seed
```

> ⚠️ Este flujo elimina los datos locales actuales de la base.

## Credenciales de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@unimayor.edu.co | admin123 |
| Miembro | johan@unimayor.edu.co | est123 |

Estas credenciales corresponden al seed vigente y son las que se restauran tras ejecutar el flujo de recuperación local.

## Datos Seedeados

- 32 competencias
- 9 miembros
- 2 proyectos
- 2 productos académicos
- 4 participaciones

## API Routes

| Ruta | Métodos |
|------|---------|
| `/api/auth/login` | POST |
| `/api/members` | GET, POST |
| `/api/members/[id]` | GET, PUT, DELETE |
| `/api/members/[id]/links` | POST, PUT, DELETE |
| `/api/members/[id]/competencies` | PUT |
| `/api/projects` | GET, POST |
| `/api/projects/[id]` | GET, PUT, DELETE |
| `/api/competencies` | GET, POST |
| `/api/competencies/[id]` | GET, PUT, DELETE |

## Deployment (Vercel + Neon)

1. Crear proyecto en [neon.tech](https://neon.tech)
2. Copiar `DATABASE_URL` en Vercel → Settings → Environment Variables
3. Ejecutar localmente:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

## Convenciones

- Tipos, interfaces, variables y funciones en **inglés**
- UI copy y comentarios en **español**
- API routes: envolver handlers en `try/catch`, retornar errores con `NextResponse.json({ error: "..." }, { status: 500 })`
- Typing estricto: evitar `any`; usar tipos compartidos de `@/types`
- Imports con alias `@/...`
- Estilo visual: Tailwind con bordes pixel, superficies neutrales, badges de estado

## Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Build de producción |
| `pnpm start` | Iniciar build de producción |
| `pnpm lint` | Linting |
| `npx prisma studio` | Abrir GUI de Prisma |
| `npx prisma migrate dev` | Nueva migración |
| `npx prisma migrate deploy` | Aplicar migraciones existentes |
| `npx prisma db push --force-reset` | Reset local + sincronización rápida con schema |
| `npx prisma db seed` | Poblar base de datos |
