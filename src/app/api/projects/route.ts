import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureMemberExists } from "@/lib/member-provision";
import type { CategoryType, ApprovalStatus, ProjectAccess } from "@/types";
import type { Prisma } from "@/generated/client";
import { createProjectSchema } from "@/lib/validations";
import { requireAuth } from "@/lib/auth";

const projectInclude = {
  members: {
    include: {
      member: true,
    },
  },
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
    members: (project.members || []).map((pm) => ({
      id: pm.id,
      memberId: pm.memberId,
      access: pm.access as ProjectAccess,
      memberName: pm.member.fullName,
      memberPhotoUrl: pm.member.photoUrl ?? "",
      memberCareer: pm.member.career ?? "",
    })),
    products: (project.products || []).map((prod) => ({
      id: prod.id,
      projectId: prod.projectId,
      title: prod.title,
      description: prod.description,
      categoryType: prod.categoryType as CategoryType,
      approvalStatus: prod.approvalStatus as ApprovalStatus,
      createdBy: prod.createdBy ?? undefined,
      technologies: Array.isArray(prod.technologies) ? (prod.technologies as string[]) : undefined,
      images: Array.isArray(prod.images) ? (prod.images as string[]) : undefined,
      repositoryUrl: prod.repositoryUrl ?? undefined,
      demoUrl: prod.demoUrl ?? undefined,
      publicationSource: prod.publicationSource ?? undefined,
      documentUrl: prod.documentUrl ?? undefined,
      city: prod.city ?? undefined,
      eventName: prod.eventName ?? undefined,
      venue: prod.venue ?? undefined,
      startDate: prod.startDate?.toISOString(),
      endDate: prod.endDate?.toISOString(),
      participations: (prod.participations || []).map((part) => ({
        id: part.id,
        memberId: part.memberId,
        productId: part.productId,
        productRole: part.productRole,
        startDate: part.startDate.toISOString(),
        endDate: part.endDate?.toISOString(),
        memberName: part.member.fullName,
        memberPhotoUrl: part.member.photoUrl ?? "",
        memberCareer: part.member.career ?? "",
      })),
    })),
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const createdBy = searchParams.get("createdBy");
    const participatedBy = searchParams.get("participatedBy");

    let where: Prisma.ProjectWhereInput | undefined;

    if (createdBy) {
      where = { createdBy: Number(createdBy) };
    }

    if (participatedBy) {
      const memberId = Number(participatedBy);
      // Aparece si participa en algún producto O si forma parte del equipo
      // del proyecto, aunque todavía no tenga productos asignados.
      where = {
        ...where,
        OR: [
          { products: { some: { participations: { some: { memberId } } } } },
          { members: { some: { memberId } } },
        ],
      };
    }

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
    const auth = await requireAuth(request);
    if (auth.error) return auth.error;

    const body = createProjectSchema.parse(await request.json());

    // El creador se toma de la sesión, no del body (no falsificable).
    const createdBy = auth.session.userId;
    await ensureMemberExists(createdBy);

    // El creador no se guarda en el equipo: su acceso es implícito y total.
    const team = (body.members || []).filter((m) => m.memberId !== createdBy);
    await Promise.all(team.map((m) => ensureMemberExists(m.memberId)));

    const created = await prisma.project.create({
      data: {
        title: body.title,
        objective: body.objective,
        awards: body.awards || null,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        coverImageUrl: (body.coverImageUrl as string) || null,
        createdBy,
        approvalStatus: "PENDING",
        members: {
          create: team.map((m) => ({ memberId: m.memberId, access: m.access })),
        },
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
