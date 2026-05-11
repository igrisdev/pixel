import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const memberId = Number(id);
    const body = await request.json();
    const { competencyIds } = body;

    if (!Array.isArray(competencyIds)) {
      return NextResponse.json({ error: "competencyIds debe ser un array" }, { status: 400 });
    }

    // Transacción: eliminar todos los links actuales y crear los nuevos
    await prisma.$transaction(async (tx) => {
      // Eliminar competencias actuales del miembro
      await tx.memberCompetency.deleteMany({
        where: { memberId },
      });

      // Crear las nuevas relaciones
      if (competencyIds.length > 0) {
        await tx.memberCompetency.createMany({
          data: competencyIds.map((compId: number) => ({
            memberId,
            competencyId: compId,
          })),
        });
      }
    });

    // Obtener las competencias actualizadas para retornar
    const memberCompetencies = await prisma.memberCompetency.findMany({
      where: { memberId },
      include: { competency: true },
    });

    return NextResponse.json({
      data: memberCompetencies.map((mc) => ({
        id: mc.competency.id,
        name: mc.competency.name,
        description: mc.competency.description,
        type: mc.competency.type,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json(
      { error: process.env.NODE_ENV === "development" ? `No se pudieron actualizar las competencias: ${message}` : "No se pudieron actualizar las competencias" },
      { status: 500 },
    );
  }
}