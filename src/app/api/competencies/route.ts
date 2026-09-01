import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-error";
import { prisma } from "@/lib/prisma";
import { Competency } from "@/types";
import { CompetencyType } from "@/generated/client";
import { createCompetencySchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/auth";

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
    return apiError(error, "No se pudieron cargar las competencias");
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;

    const body = createCompetencySchema.parse(await request.json());

    const created = await prisma.competency.create({
      data: {
        name: body.name,
        description: body.description ?? "",
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
    return apiError(error, "No se pudo crear la competencia");
  }
}
