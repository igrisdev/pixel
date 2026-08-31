// Configuración pública del sitio, usada por los metadatos, el sitemap y robots.
// En producción hay que definir NEXT_PUBLIC_SITE_URL con el dominio real:
// sin ella las URLs canónicas y las imágenes para compartir apuntarían a localhost.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

export const SITE_NAME = "Pixel | Semillero de Investigación UNIMAYOR";

export const SITE_SHORT_NAME = "Semillero Pixel";

export const SITE_DESCRIPTION =
  "Portafolio del Semillero de Investigación Pixel de la Institución Universitaria Colegio Mayor del Cauca: proyectos de software, artículos, ponencias y el talento de sus integrantes.";

export const SITE_KEYWORDS = [
  "Semillero Pixel",
  "UNIMAYOR",
  "Colegio Mayor del Cauca",
  "semillero de investigación",
  "desarrollo de software",
  "proyectos universitarios",
  "Popayán",
  "portafolio de estudiantes",
  "ingeniería informática",
];

// Construye una URL absoluta a partir de una ruta interna.
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
