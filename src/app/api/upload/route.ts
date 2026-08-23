import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import { ensureUploadDir, generateFileName, validateFile, UploadType, UPLOAD_CONFIG } from "@/lib/upload";
import { requireAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth.error) return auth.error;

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
    }

    if (!type || !UPLOAD_CONFIG[type as UploadType]) {
      return NextResponse.json({ error: "Tipo de subida no válido" }, { status: 400 });
    }

    const uploadType = type as UploadType;

    const validation = validateFile(file, uploadType);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const uploadDir = ensureUploadDir(uploadType);
    const fileName = generateFileName(file.name);
    const filePath = `${uploadDir}/${fileName}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await fs.writeFile(filePath, buffer);

    const fileUrl = `/uploads/${uploadType}/${fileName}`;

    return NextResponse.json({
      data: { url: fileUrl, fileName, type: uploadType },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Error al subir el archivo" }, { status: 500 });
  }
}
