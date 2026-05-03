import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ensureMemberExists } from "@/lib/member-provision";
import { CategoryType, ApprovalStatus } from "@/types";

const projectInclude = {
  products: {
    include: {
      participations: {
        include: {
          member: true,
        },
      },
    },
  },
} as const;

type ProjectWithRelations = Prisma.ProjectGetPayload<{ include: typeof projectInclude }>;

function toProjectResponse(project: ProjectWithRelations) {
  return {
    id: project.id,
    title: project.title,
    objective: project.objective,
    awards: project.awards ?? undefined,
    startDate: project.startDate.toISOString(),
    endDate: project.endDate?.toISOString(),
    createdBy: project.createdBy,
    coverImageUrl: project.coverImageUrl ?? "",
    approvalStatus: project.approvalStatus,
    products: (project.products || []).map((prod) => ({
      id: prod.id,
      projectId: prod.projectId,
      title: prod.title,
      description: prod.description,
      categoryType: prod.categoryType as CategoryType,
      approvalStatus: prod.approvalStatus as ApprovalStatus,
      technologies: Array.isArray(prod.technologies) ? (prod.technologies as string[]) : undefined,
      repositoryUrl: prod.repositoryUrl ?? undefined,
      demoUrl: prod.demoUrl ?? undefined,
      publicationSource: prod.publicationSource ?? undefined,
      documentUrl: prod.documentUrl ?? undefined,
      location: prod.location ?? undefined,
      participations: (prod.participations || []).map((part) => ({
        id: part.id,
        memberId: part.memberId,
        productId: part.productId,
        productRole: part.productRole,
        startDate: part.startDate.toISOString(),
        endDate: part.endDate?.toISOString(),
        memberName: part.member.fullName,
        memberPhotoUrl: part.member.photoUrl ?? "",
      })),
    })),
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const createdBy = searchParams.get("createdBy");

    const where = createdBy ? { createdBy: Number(createdBy) } : undefined;

    const projects = await prisma.project.findMany({
      where,
      include: projectInclude,
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ data: projects.map(toProjectResponse) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? `No se pudieron cargar los proyectos: ${message}`
            : "No se pudieron cargar los proyectos",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    await ensureMemberExists(body.createdBy);

    const created = await prisma.project.create({
      data: {
        title: body.title,
        objective: body.objective,
        awards: body.awards || null,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        coverImageUrl: body.coverImageUrl || null,
        createdBy: body.createdBy,
        approvalStatus: "PENDING",
      },
      include: projectInclude,
    });

    return NextResponse.json({ data: toProjectResponse(created) }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? `No se pudo crear el proyecto: ${message}`
            : "No se pudo crear el proyecto",
      },
      { status: 500 },
    );
  }
}
