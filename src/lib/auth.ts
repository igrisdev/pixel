import { SignJWT, jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { SystemRole } from "@/types";

export const SESSION_COOKIE = "session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 días en segundos.

// Opciones base de la cookie de sesión (httpOnly, no accesible desde JS).
function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export interface SessionPayload {
  userId: number;
  role: SystemRole;
}

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET no está configurado en el entorno.");
  }
  return new TextEncoder().encode(secret);
}

// Firma un JWT de sesión con el id y rol del usuario.
export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ userId: payload.userId, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecretKey());
}

// Verifica un token y devuelve el payload, o null si es inválido/expirado.
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.userId !== "number" || typeof payload.role !== "string") {
      return null;
    }
    return { userId: payload.userId, role: payload.role as SystemRole };
  } catch {
    return null;
  }
}

// Adjunta la cookie de sesión firmada a una respuesta. Se setea sobre el
// NextResponse (en vez de next/headers) para que el módulo sea seguro también
// en el runtime Edge del middleware.
export async function attachSessionCookie(
  response: NextResponse,
  payload: SessionPayload,
): Promise<void> {
  const token = await signSession(payload);
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(SESSION_MAX_AGE));
}

export function clearSessionCookieOn(response: NextResponse): void {
  response.cookies.set(SESSION_COOKIE, "", sessionCookieOptions(0));
}

// Lee la sesión desde la cookie de la request (para route handlers Node).
export async function getSession(request: Request): Promise<SessionPayload | null> {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${SESSION_COOKIE}=`));
  if (!match) return null;
  const token = decodeURIComponent(match.slice(SESSION_COOKIE.length + 1));
  if (!token) return null;
  return verifySessionToken(token);
}

// ---- Guards para route handlers ----
// Cada guard devuelve { session } en éxito, o { error: NextResponse } para
// retornar directamente desde el handler.

type GuardResult =
  | { session: SessionPayload; error?: undefined }
  | { session?: undefined; error: NextResponse };

export async function requireAuth(request: Request): Promise<GuardResult> {
  const session = await getSession(request);
  if (!session) {
    return { error: NextResponse.json({ error: "No autenticado" }, { status: 401 }) };
  }
  return { session };
}

export async function requireAdmin(request: Request): Promise<GuardResult> {
  const result = await requireAuth(request);
  if (result.error) return result;
  if (result.session.role !== "ADMIN") {
    return { error: NextResponse.json({ error: "Acceso denegado" }, { status: 403 }) };
  }
  return { session: result.session };
}

// Permite si el usuario es el dueño (mismo id) o admin.
export async function requireSelfOrAdmin(request: Request, targetId: number): Promise<GuardResult> {
  const result = await requireAuth(request);
  if (result.error) return result;
  if (result.session.role !== "ADMIN" && result.session.userId !== targetId) {
    return { error: NextResponse.json({ error: "Acceso denegado" }, { status: 403 }) };
  }
  return { session: result.session };
}

// Verificación de JWT para el middleware (runtime Edge). Recibe el token crudo.
export async function verifyRequestToken(request: NextRequest): Promise<SessionPayload | null> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
