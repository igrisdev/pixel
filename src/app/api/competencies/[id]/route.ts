import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Competency } from "@/types";
import { CompetencyType } from "@/generated/client";
import { updateCompetencySchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/auth";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const competencyId = Number(id);

    const competency = await prisma.competency.findUnique({
      where: { id: competencyId },
    });

    if (!competency) {
      return NextResponse.json({ error: "Competencia no encontrada" }, { status: 404 });
    }

    const data: Competency = {
      id: competency.id,
      name: competency.name,
      description: competency.description,
      type: competency.type,
    };

    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? `No se pudo cargar la competencia: ${message}`
            : "No se pudo cargar la competencia",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;

    const { id } = await context.params;
    const competencyId = Number(id);
    const body = updateCompetencySchema.parse(await request.json());

    const updated = await prisma.competency.update({
      where: { id: competencyId },
      data: {
        name: body.name,
        description: body.description,
        type: body.type as CompetencyType,
      },
    });

    const data: Competency = {
      id: updated.id,
      name: updated.name,
      description: updated.description,
      type: updated.type,
    };

    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? `No se pudo actualizar la competencia: ${message}`
            : "No se pudo actualizar la competencia",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;

    const { id } = await context.params;
    const competencyId = Number(id);

    await prisma.competency.delete({
      where: { id: competencyId },
    });

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? `No se pudo eliminar la competencia: ${message}`
            : "No se pudo eliminar la competencia",
      },
      { status: 500 },
    );
  }
}
