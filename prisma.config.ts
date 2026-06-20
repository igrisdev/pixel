import { defineConfig } from "prisma/config";

// Cargar variables de .env en desarrollo local (Node 22+, sin dependencias externas).
// En producción/build el archivo .env no existe y DATABASE_URL viene del entorno del
// contenedor, por lo que la carga se ignora silenciosamente.
try {
  process.loadEnvFile();
} catch {
  // .env ausente: se omite la carga.
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
