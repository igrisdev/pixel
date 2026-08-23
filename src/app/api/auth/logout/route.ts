import { NextResponse } from "next/server";
import { clearSessionCookieOn } from "@/lib/auth";

export async function POST() {
  try {
    const response = NextResponse.json({ data: { success: true } });
    clearSessionCookieOn(response);
    return response;
  } catch {
    return NextResponse.json({ error: "No se pudo cerrar la sesión" }, { status: 500 });
  }
}
