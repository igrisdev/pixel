import { NextResponse } from "next/server";
import { ZodError } from "zod";

// Los detalles técnicos solo se registran en desarrollo. Si NODE_ENV es
// "production" —o no está definida— no se escribe nada en consola.
// Cambia esta constante si algún día quieres registrar también en producción.
const LOG_ERRORS = process.env.NODE_ENV === "development";

// Error cuyo mensaje SÍ está pensado para mostrarse al usuario
// (permisos, recursos no encontrados, reglas de negocio).
export class AppError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.name = "AppError";
    this.status = status;
  }
}

/**
 * Respuesta de error única para las rutas de API.
 *
 * Regla: el detalle técnico NUNCA sale al cliente, sin depender de ninguna
 * variable de entorno. Antes se enviaba cuando NODE_ENV era "development", lo
 * que exponía rutas de archivo, nombres de tablas y consultas si esa variable
 * quedaba mal configurada.
 */
export function apiError(error: unknown, fallback: string, status = 500) {
  // Errores de validación: describen el dato que envió el propio usuario,
  // así que es seguro (y útil) devolverlos.
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: error.issues.map((i) => i.message).join(" ") },
      { status: 400 },
    );
  }

  // Mensajes redactados a propósito para el usuario.
  if (error instanceof AppError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  if (LOG_ERRORS) {
    console.error(`[api] ${fallback}:`, error);
  }

  return NextResponse.json({ error: fallback }, { status });
}
