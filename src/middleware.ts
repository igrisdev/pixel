import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyRequestToken } from "@/lib/auth";

// Rutas del dashboard que requieren rol ADMIN.
const ADMIN_PREFIXES = [
  "/dashboard/users",
  "/dashboard/approvals",
  "/dashboard/audits",
  "/dashboard/competencies",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await verifyRequestToken(request);

  // Sin sesión válida → al login (guardando el destino).
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Rutas de solo-admin.
  const isAdminRoute = ADMIN_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (isAdminRoute && session.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
