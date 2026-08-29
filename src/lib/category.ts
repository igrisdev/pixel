import { CategoryType } from "@/types";

// Etiqueta completa de la categoría, para selectores y formularios.
export const CATEGORY_LABELS: Record<CategoryType, string> = {
  DEVELOPMENT: "Software",
  WRITING: "Artículo / Memoria",
  EVENT: "Evento / Poster / Ponencia",
};

// Etiqueta corta, para los badges de las tarjetas donde el espacio es limitado.
export const CATEGORY_SHORT_LABELS: Record<CategoryType, string> = {
  DEVELOPMENT: "SOFTWARE",
  WRITING: "ARTÍCULO",
  EVENT: "EVENTO",
};

export function categoryLabel(type: CategoryType): string {
  return CATEGORY_LABELS[type] ?? type;
}

export function categoryShortLabel(type: CategoryType): string {
  return CATEGORY_SHORT_LABELS[type] ?? type;
}
