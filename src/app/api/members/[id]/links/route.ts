import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const memberId = Number(id);
    const body = await request.json();

    const { platform, url } = body;

    if (!platform || !url) {
      return NextResponse.json({ error: "Platform y URL son requeridos" }, { status: 400 });
    }

    const link = await prisma.professionalLink.create({
      data: {
        platform,
        url,
        memberId,
      },
    });

    return NextResponse.json({ data: link });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json(
      { error: process.env.NODE_ENV === "development" ? `No se pudo crear el enlace: ${message}` : "No se pudo crear el enlace" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const memberId = Number(id);
    const { searchParams } = new URL(request.url);
    const linkId = searchParams.get("linkId");

    if (!linkId) {
      return NextResponse.json({ error: "linkId es requerido" }, { status: 400 });
    }

    await prisma.professionalLink.delete({
      where: { id: Number(linkId), memberId },
    });

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json(
      { error: process.env.NODE_ENV === "development" ? `No se pudo eliminar el enlace: ${message}` : "No se pudo eliminar el enlace" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const memberId = Number(id);
    const { searchParams } = new URL(request.url);
    const linkId = searchParams.get("linkId");
    const body = await request.json();
    const { platform, url } = body;

    if (!linkId) {
      return NextResponse.json({ error: "linkId es requerido" }, { status: 400 });
    }

    if (!platform || !url) {
      return NextResponse.json({ error: "Platform y URL son requeridos" }, { status: 400 });
    }

    const updated = await prisma.professionalLink.update({
      where: { id: Number(linkId), memberId },
      data: { platform, url },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json(
      { error: process.env.NODE_ENV === "development" ? `No se pudo actualizar el enlace: ${message}` : "No se pudo actualizar el enlace" },
      { status: 500 },
    );
  }
}