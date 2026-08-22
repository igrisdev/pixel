import { z } from "zod";

const uploadUrlSchema = z.string().startsWith("/uploads/");
const validUrlOrUpload = z.union([
  z.string().url("URL inválida"),
  uploadUrlSchema,
  z.null(),
  z.literal(""),
]).optional();

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export const createMemberSchema = z.object({
  fullName: z.string().min(1, "El nombre es requerido").max(200, "Nombre muy largo"),
  institutionalEmail: z.string().email("Email institucional inválido"),
  personalEmail: z.string().email("Email personal inválido").optional().or(z.literal("")),
  passwordHash: z.string().min(1, "La contraseña es requerida"),
  professionalProfile: z.string().optional().or(z.literal("")),
  career: z.string().min(1, "La carrera es requerida"),
  role: z.string().optional().or(z.literal("")),
  systemRole: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
  academicStatus: z.enum(["STUDENT", "GRADUATE"]).default("STUDENT"),
  photoUrl: validUrlOrUpload,
  cvUrl: validUrlOrUpload,
});

export const updateMemberSchema = z.object({
  fullName: z.string().min(1, "El nombre es requerido").max(200, "Nombre muy largo").optional(),
  institutionalEmail: z.string().email("Email institucional inválido").optional(),
  personalEmail: z.string().email("Email personal inválido").optional().or(z.literal("")),
  passwordHash: z.string().min(1, "La contraseña es requerida").optional(),
  professionalProfile: z.string().optional().or(z.literal("")),
  career: z.string().optional(),
  role: z.string().optional(),
  systemRole: z.enum(["ADMIN", "MEMBER"]).optional(),
  academicStatus: z.enum(["STUDENT", "GRADUATE"]).optional(),
  photoUrl: validUrlOrUpload,
  cvUrl: validUrlOrUpload,
  isBanned: z.boolean().optional(),
});

export const createProjectSchema = z.object({
  title: z.string().min(1, "El título es requerido").max(200, "Título muy largo"),
  objective: z.string().min(1, "El objetivo es requerido"),
  awards: z.string().optional().or(z.literal("")),
  startDate: z.string().min(1, "La fecha de inicio es requerida"),
  endDate: z.string().optional().or(z.literal("")),
  coverImageUrl: validUrlOrUpload,
  createdBy: z.number().min(1, "El creador es requerido"),
});

export const updateProjectSchema = z.object({
  title: z.string().min(1, "El título es requerido").max(200, "Título muy largo").optional(),
  objective: z.string().optional(),
  awards: z.string().optional().or(z.literal("")),
  startDate: z.string().optional(),
  endDate: z.string().optional().or(z.literal("")),
  coverImageUrl: validUrlOrUpload,
  approvalStatus: z.enum(["PENDING", "ACTIVE", "REJECTED"]).optional(),
  products: z.array(z.object({
    id: z.number().optional(),
    title: z.string().min(1),
    description: z.string().optional(),
    categoryType: z.string().optional(),
    technologies: z.array(z.string()).optional(),
    repositoryUrl: z.union([z.string().url("URL inválida").nullish(), z.literal("")]),
    demoUrl: z.union([z.string().url("URL inválida").nullish(), z.literal("")]),
    publicationSource: z.string().optional().or(z.literal("")),
    documentUrl: validUrlOrUpload,
    location: z.string().optional().or(z.literal("")),
    approvalStatus: z.string().optional(),
    participations: z.array(z.object({
      id: z.number().optional(),
      memberId: z.number(),
      productRole: z.string(),
      startDate: z.string(),
      endDate: z.string().optional(),
    })).optional(),
  })).optional(),
});

export const createProductSchema = z.object({
  // Miembro que crea el producto: debe participar en el proyecto.
  requesterId: z.number().min(1, "El solicitante es requerido"),
  title: z.string().min(1, "El título es requerido").max(200, "Título muy largo"),
  description: z.string().min(1, "La descripción es requerida"),
  categoryType: z.enum(["DEVELOPMENT", "EVENT", "WRITING"]),
  technologies: z.array(z.string()).optional(),
  repositoryUrl: z.union([z.string().url("URL inválida").nullish(), z.literal("")]),
  demoUrl: z.union([z.string().url("URL inválida").nullish(), z.literal("")]),
  publicationSource: z.string().optional().or(z.literal("")),
  documentUrl: validUrlOrUpload,
  location: z.string().optional().or(z.literal("")),
  participations: z
    .array(
      z.object({
        memberId: z.number(),
        productRole: z.string().min(1, "El rol es requerido"),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }),
    )
    .optional(),
});

export const createCompetencySchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100, "Nombre muy largo"),
  description: z.string().optional().or(z.literal("")),
  type: z.enum(["TECHNICAL", "SOFT"]),
});

export const updateCompetencySchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100, "Nombre muy largo").optional(),
  description: z.string().optional().or(z.literal("")),
  type: z.enum(["TECHNICAL", "SOFT"]).optional(),
});

export const createLinkSchema = z.object({
  platform: z.string().min(1, "La plataforma es requerida").max(50),
  url: z.string().url("URL inválida"),
});

export const updateLinkSchema = z.object({
  platform: z.string().min(1, "La plataforma es requerida").max(50).optional(),
  url: z.string().url("URL inválida").optional(),
});

export const updateCompetenciesSchema = z.object({
  competencyIds: z.array(z.number()),
});