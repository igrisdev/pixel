import { CategoryType } from "@/types";
import { CATEGORY_LABELS } from "@/lib/category";

// Roles específicos según el tipo de producto.
export const ROLES_BY_CATEGORY: Record<CategoryType, string[]> = {
  DEVELOPMENT: [
    "Frontend",
    "Backend",
    "Full Stack",
    "Desarrollador Móvil",
    "Base de Datos",
    "DevOps / Infraestructura",
    "QA / Pruebas",
    "Diseño UI/UX",
    "Arquitecto de Software",
    "Analista de Requisitos",
    "Ciencia de Datos / IA",
  ],
  WRITING: ["Autor Principal", "Coautor", "Investigador", "Revisor / Editor"],
  EVENT: ["Ponente", "Expositor", "Tallerista", "Organizador", "Moderador"],
};

// Roles válidos en cualquier tipo de producto. "Líder de Producto" es quien
// lidera este entregable concreto; "Líder de Proyecto" lidera el proyecto macro.
export const CROSS_ROLES = [
  "Líder de Producto",
  "Líder de Proyecto",
  "Colaborador",
  "Docente Asesor",
];

// Rol por defecto de quien crea el producto.
export const DEFAULT_CREATOR_ROLE = "Líder de Producto";

export function rolesForCategory(type: CategoryType): string[] {
  return ROLES_BY_CATEGORY[type] ?? [];
}

// Etiqueta del grupo de roles propios de la categoría, para el selector.
export function categoryRoleGroupLabel(type: CategoryType): string {
  return `Roles de ${CATEGORY_LABELS[type] ?? type}`;
}
