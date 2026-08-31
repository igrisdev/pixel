// Utilidades para mostrar enlaces sin romper el diseño.

// Detecta si un texto es realmente una URL http(s).
export function isHttpUrl(value?: string | null): boolean {
  if (!value) return false;
  try {
    const u = new URL(value.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

// Devuelve el dominio legible (sin "www."), para etiquetar el enlace en vez de
// volcar la URL completa: "minas.medellin.unal.edu.co".
export function prettyDomain(value: string): string {
  try {
    return new URL(value.trim()).hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
}

// Avatar de respaldo cuando la foto del integrante no carga (archivo borrado o
// servido desde otro entorno).
export function getAvatarUrl(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "Integrante",
  )}&background=1E293B&color=fff&size=150`;
}
