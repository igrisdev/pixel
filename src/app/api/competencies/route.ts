import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Competency } from "@/types";
import { CompetencyType } from "@prisma/client";

export async function GET() {
  try {
    const competencies = await prisma.competency.findMany({
      orderBy: [{ type: "asc" }, { name: "asc" }],
    });

    const data: Competency[] = competencies.map((competency) => ({
      id: competency.id,
      name: competency.name,
      description: competency.description,
      type: competency.type,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? `No se pudieron cargar las competencias: ${message}`
            : "No se pudieron cargar las competencias",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const created = await prisma.competency.create({
      data: {
        name: body.name,
        description: body.description,
        type: body.type as CompetencyType,
      },
    });

    const data: Competency = {
      id: created.id,
      name: created.name,
      description: created.description,
      type: created.type,
    };

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? `No se pudo crear la competencia: ${message}`
            : "No se pudo crear la competencia",
      },
      { status: 500 },
    );
  }
}
