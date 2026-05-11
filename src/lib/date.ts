export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateShort(
  date: string | Date | null | undefined,
): string {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatYear(date: string | Date | null | undefined): string {
  if (!date) return "-";

  return new Date(date).getFullYear().toString();
}
