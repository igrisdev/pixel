import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureMemberExists } from "@/lib/member-provision";
import { createProductSchema } from "@/lib/validations";
import type { CategoryType, ApprovalStatus } from "@/types";
import type { Prisma } from "@/generated/client";

const productInclude = {
  participations: {
    include: {
      member: true,
    },
  },
} as const;

type ProductWithRelations = Prisma.AcademicProductGetPayload<{ include: typeof productInclude }>;

function toProductResponse(prod: ProductWithRelations) {
  return {
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
      memberCareer: part.member.career ?? "",
    })),
  };
}

// POST: un integrante que participa en el proyecto agrega un nuevo producto interno.
// No modifica el proyecto ni otros productos existentes.
export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const projectId = Number(id);
    const body = createProductSchema.parse(await request.json());

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, createdBy: true, startDate: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
    }

    // Autorización: el solicitante debe ser creador del proyecto o participar
    // en alguno de sus productos.
    const isCreator = project.createdBy === body.requesterId;
    let isParticipant = false;

    if (!isCreator) {
      const participation = await prisma.participation.findFirst({
        where: {
          memberId: body.requesterId,
          product: { projectId },
        },
        select: { id: true },
      });
      isParticipant = Boolean(participation);
    }

    if (!isCreator && !isParticipant) {
      return NextResponse.json(
        { error: "No participas en este proyecto." },
        { status: 403 },
      );
    }

    // El solicitante siempre queda como participante del nuevo producto.
    const participationsInput = [...(body.participations || [])];
    if (!participationsInput.some((p) => p.memberId === body.requesterId)) {
      participationsInput.unshift({
        memberId: body.requesterId,
        productRole: "Autor",
        startDate: undefined,
        endDate: undefined,
      });
    }

    const projectStart = project.startDate.toISOString();

    // Aseguramos que los miembros existan antes de crear participaciones.
    await Promise.all(participationsInput.map((p) => ensureMemberExists(p.memberId)));

    const created = await prisma.academicProduct.create({
      data: {
        projectId,
        title: body.title,
        description: body.description,
        categoryType: body.categoryType,
        approvalStatus: "PENDING",
        technologies: body.technologies && body.technologies.length > 0 ? body.technologies : undefined,
        repositoryUrl: body.repositoryUrl || null,
        demoUrl: body.demoUrl || null,
        publicationSource: body.publicationSource || null,
        documentUrl: body.documentUrl || null,
        location: body.location || null,
        participations: {
          create: participationsInput.map((p) => ({
            memberId: p.memberId,
            productRole: p.productRole,
            startDate: p.startDate ? new Date(p.startDate) : new Date(projectStart),
            endDate: p.endDate ? new Date(p.endDate) : null,
          })),
        },
      },
      include: productInclude,
    });

    return NextResponse.json({ data: toProductResponse(created) }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? `No se pudo crear el producto: ${message}`
            : "No se pudo crear el producto",
      },
      { status: 500 },
    );
  }
}
