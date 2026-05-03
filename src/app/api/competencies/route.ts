import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Competency } from "@/types";

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
