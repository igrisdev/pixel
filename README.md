# Portfolio Pixel

Sistema de gestión de portafolios para estudiantes universitarios — permite a miembros administrar proyectos, competencias y enlaces profesionales.

## Stack Tecnológico

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
- **Estado**: Zustand + persist middleware
- **Backend**: Next.js API Routes
- **ORM**: Prisma 7 con PostgreSQL
- **Deploy**: Vercel + Neon (PostgreSQL serverless)

## Arquitectura

Ver Figura 2: Diagrama C4 General (en el paper académico).

## Rutas de la Aplicación

### Rutas Públicas
- `/` — Landing page con métricas, proyectos destacados y talento
- `/login` — Autenticación de usuarios
- `/search` — Búsqueda de integrantes
- `/project/[id]` — Detalle de proyecto público
- `/profile/[id]` — Perfil de miembro público

### Rutas del Dashboard (protegidas por autenticación)
- `/dashboard` — Redirige según rol (Admin → /dashboard/users, Member → /dashboard/profile)
- `/dashboard/users` — Gestión de Usuarios (solo Admin)
- `/dashboard/approvals` — Aprobaciones Pendientes (solo Admin)
- `/dashboard/audits` — Auditoría Global (solo Admin)
- `/dashboard/competencies` — Catálogo de Competencias (solo Admin)
- `/dashboard/profile` — Mi Perfil (Admin + Member)
- `/dashboard/projects` — Mis Proyectos (Admin + Member)

## API Routes

| Ruta | Métodos | Descripción |
|------|---------|-------------|
| `/api/auth/login` | POST | Autenticación de usuarios |
| `/api/members` | GET, POST | Listar/Crear miembros |
| `/api/members/[id]` | GET, PUT, DELETE | CRUD de miembro individual |
| `/api/members/[id]/links` | POST, PUT, DELETE | CRUD de enlaces profesionales |
| `/api/members/[id]/competencies` | PUT | Sincronizar competencias del miembro |
| `/api/projects` | GET, POST | Listar/Crear proyectos |
| `/api/projects/[id]` | GET, PUT, DELETE | CRUD de proyecto individual |
| `/api/competencies` | GET, POST | Listar/Crear competencias |
| `/api/competencies/[id]` | GET, PUT, DELETE | CRUD de competencia individual |

## Instalación

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev

# Iniciar PostgreSQL local (Docker)
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

- 32 competencias (técnicas y transversales)
- 9 miembros
- 39 relaciones miembro-competencia
- 1 enlace profesional
- 2 proyectos
- 2 productos académicos
- 4 participaciones

## Deployment

### Vercel + Neon (recomendado)

1. Crear cuenta en [neon.tech](https://neon.tech)
2. Crear nuevo proyecto PostgreSQL (`pixel_db`)
3. Copiar `DATABASE_URL` de Neon
4. En Vercel Dashboard → Settings → Environment Variables → agregar `DATABASE_URL`
5. Desde PC local:
   ```bash
   # Cambiar DATABASE_URL en .env a la de Neon
   npx prisma migrate deploy
   npx prisma db seed
   ```

## Modelo de Datos

```
Member (id, fullName, institutionalEmail, personalEmail, passwordHash,
       professionalProfile, career, role, systemRole, academicStatus,
       photoUrl, cvUrl, isBanned)
  ├── ProfessionalLink (memberId → Member, onDelete Cascade)
  ├── Competency (many-to-many con Member)
  ├── Project (createdBy → Member)
  └── Participation (memberId → Member, productId → AcademicProduct)

Project (id, title, objective, awards, startDate, endDate,
         coverImageUrl, approvalStatus, createdBy → Member)
  └── AcademicProduct (projectId → Project, onDelete Cascade)
       └── Participation (productId → AcademicProduct, onDelete Cascade)
```

## Convenciones de Código

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
