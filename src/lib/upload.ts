import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

export const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const ALLOWED_PDF_TYPES = ["application/pdf"];

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10MB

export type UploadType = "profiles" | "cvs" | "covers" | "documents" | "products";

export const UPLOAD_CONFIG: Record<UploadType, { allowedTypes: string[]; maxSize: number }> = {
  profiles: {
    allowedTypes: ALLOWED_IMAGE_TYPES,
    maxSize: MAX_IMAGE_SIZE,
  },
  cvs: {
    allowedTypes: ALLOWED_PDF_TYPES,
    maxSize: MAX_PDF_SIZE,
  },
  covers: {
    allowedTypes: ALLOWED_IMAGE_TYPES,
    maxSize: MAX_IMAGE_SIZE,
  },
  documents: {
    allowedTypes: ALLOWED_PDF_TYPES,
    maxSize: MAX_PDF_SIZE,
  },
  // Galería de imágenes de los productos académicos.
  products: {
    allowedTypes: ALLOWED_IMAGE_TYPES,
    maxSize: MAX_IMAGE_SIZE,
  },
};

export function ensureUploadDir(type: UploadType): string {
  const dir = path.join(UPLOAD_DIR, type);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

export function generateFileName(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase();
  return `${randomUUID()}${ext}`;
}

export function validateFile(file: File, type: UploadType): { valid: boolean; error?: string } {
  const config = UPLOAD_CONFIG[type];

  if (!config) {
    return { valid: false, error: "Tipo de subida no válido" };
  }

  if (!config.allowedTypes.includes(file.type)) {
    const allowed = config.allowedTypes.map((t) => t.split("/")[1]).join(", ");
    return { valid: false, error: `Tipo de archivo no válido. Permitidos: ${allowed}` };
  }

  if (file.size > config.maxSize) {
    const maxSizeMB = config.maxSize / (1024 * 1024);
    return { valid: false, error: `Archivo demasiado grande. Máximo: ${maxSizeMB}MB` };
  }

  return { valid: true };
}
