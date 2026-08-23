import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateCompetenciesSchema } from "@/lib/validations";
import { requireSelfOrAdmin } from "@/lib/auth";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const memberId = Number(id);

    const auth = await requireSelfOrAdmin(request, memberId);
    if (auth.error) return auth.error;

    const body = updateCompetenciesSchema.parse(await request.json());
    const { competencyIds } = body;

    await prisma.member.update({
      where: { id: memberId },
      data: {
        competencies: {
          set: competencyIds.map((compId: number) => ({ id: compId })),
        },
      },
    });

    const member = await prisma.member.findUnique({
      where: { id: memberId },
      include: { competencies: true },
    });

    return NextResponse.json({
      data: member?.competencies.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        type: c.type,
      })) || [],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json(
      { error: process.env.NODE_ENV === "development" ? `No se pudieron actualizar las competencias: ${message}` : "No se pudieron actualizar las competencias" },
      { status: 500 },
    );
  }
}
