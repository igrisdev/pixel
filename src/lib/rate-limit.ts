import { prisma } from "@/lib/prisma";

// Limitador de tasa persistente respaldado por PostgreSQL (ventana fija).
// El estado se comparte entre instancias serverless, a diferencia de un contador
// en memoria. Una fila por clave: no acumula una fila por intento.

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

// Registra un intento y devuelve si está permitido bajo el límite dado.
export async function hitRateLimit(
  key: string,
  max = 5,
  windowMs = 15 * 60 * 1000,
): Promise<RateLimitResult> {
  const now = new Date();
  const nextReset = new Date(now.getTime() + windowMs);

  const result = await prisma.$transaction(async (tx) => {
    const existing = await tx.rateLimit.findUnique({ where: { key } });

    // Sin registro o ventana expirada → reiniciamos el contador.
    if (!existing || now >= existing.resetAt) {
      await tx.rateLimit.upsert({
        where: { key },
        create: { key, count: 1, resetAt: nextReset },
        update: { count: 1, resetAt: nextReset },
      });
      return { allowed: true, retryAfterSeconds: 0 };
    }

    const newCount = existing.count + 1;
    await tx.rateLimit.update({ where: { key }, data: { count: newCount } });

    if (newCount > max) {
      const retryAfterSeconds = Math.ceil((existing.resetAt.getTime() - now.getTime()) / 1000);
      return { allowed: false, retryAfterSeconds };
    }
    return { allowed: true, retryAfterSeconds: 0 };
  });

  // Limpieza oportunista de claves expiradas para que la tabla no crezca sin
  // límite (se ejecuta ~1% de las veces, fuera de la ruta crítica).
  if (Math.random() < 0.01) {
    prisma.rateLimit
      .deleteMany({ where: { resetAt: { lt: now } } })
      .catch(() => {});
  }

  return result;
}

// Limpia el contador de una clave (p. ej. tras un login exitoso).
export async function resetRateLimit(key: string): Promise<void> {
  await prisma.rateLimit.deleteMany({ where: { key } });
}

// Extrae una IP aproximada de la request para usar como clave.
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}
