import { NextResponse } from "next/server";
import { Prisma, CategoryType as PrismaCategoryType, ApprovalStatus as PrismaApprovalStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ensureMemberExists } from "@/lib/member-provision";
import { CategoryType, ApprovalStatus, Project, Participation } from "@/types";

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

function toProjectResponse(project: ProjectWithRelations): Project {
  return {
    id: project.id,
    title: project.title,
    objective: project.objective,
    awards: project.awards ?? undefined,
    startDate: project.startDate.toISOString(),
    endDate: project.endDate?.toISOString(),
    createdBy: project.createdBy,
    coverImageUrl: project.coverImageUrl ?? "",
    approvalStatus: project.approvalStatus as ApprovalStatus,
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

function toDate(value?: string) {
  if (!value) return null;
  return new Date(value);
}

type ProductPayload = NonNullable<Project["products"]>[number];

async function syncParticipations(productId: number, projectStartDate: string, incomingParts: Participation[]) {
  const existing = await prisma.participation.findMany({
    where: { productId },
    select: { id: true },
  });

  const incomingIds = new Set(incomingParts.map((p) => p.id).filter((id) => id > 0));
  const toDelete = existing.filter((p) => !incomingIds.has(p.id)).map((p) => p.id);

  if (toDelete.length > 0) {
    await prisma.participation.deleteMany({ where: { id: { in: toDelete } } });
  }

  for (const part of incomingParts) {
    await ensureMemberExists(part.memberId);

    const data = {
      memberId: part.memberId,
      productRole: part.productRole,
      startDate: toDate(part.startDate) ?? new Date(projectStartDate),
      endDate: toDate(part.endDate || undefined),
    };

    if (part.id > 0) {
      await prisma.participation.upsert({
        where: { id: part.id },
        create: { ...data, productId },
        update: data,
      });
    } else {
      await prisma.participation.create({
        data: { ...data, productId },
      });
    }
  }
}

async function syncProducts(projectId: number, incomingProducts: ProductPayload[], projectStartDate: string) {
  const existingProducts = await prisma.academicProduct.findMany({
    where: { projectId },
    select: { id: true },
  });

  const incomingIds = new Set(incomingProducts.map((p) => p.id).filter((id) => id > 0));
  const toDelete = existingProducts.filter((p) => !incomingIds.has(p.id)).map((p) => p.id);

  if (toDelete.length > 0) {
    await prisma.academicProduct.deleteMany({ where: { id: { in: toDelete } } });
  }

  for (const prod of incomingProducts) {
    const productData = {
      title: prod.title,
      description: prod.description,
      categoryType: prod.categoryType as PrismaCategoryType,
      approvalStatus: (prod.approvalStatus || "PENDING") as PrismaApprovalStatus,
      technologies: prod.technologies ?? Prisma.JsonNull,
      repositoryUrl: prod.repositoryUrl || null,
      demoUrl: prod.demoUrl || null,
      publicationSource: prod.publicationSource || null,
      documentUrl: prod.documentUrl || null,
      location: prod.location || null,
    };

    let productId = prod.id;

    if (productId > 0) {
      await prisma.academicProduct.upsert({
        where: { id: productId },
        create: { ...productData, projectId },
        update: productData,
      });
    } else {
      const created = await prisma.academicProduct.create({
        data: { ...productData, projectId },
        select: { id: true },
      });
      productId = created.id;
    }

    await syncParticipations(productId, projectStartDate, prod.participations || []);
  }
}

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const projectId = Number(id);

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: projectInclude,
    });

    if (!project) {
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ data: toProjectResponse(project) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? `No se pudo cargar el proyecto: ${message}`
            : "No se pudo cargar el proyecto",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const projectId = Number(id);
    const body = (await request.json()) as Partial<Project>;

    await prisma.$transaction(async () => {
      await prisma.project.update({
        where: { id: projectId },
        data: {
          title: body.title,
          objective: body.objective,
          awards: body.awards || null,
          startDate: body.startDate ? new Date(body.startDate) : undefined,
          endDate: body.endDate ? new Date(body.endDate) : null,
          coverImageUrl: body.coverImageUrl || null,
          approvalStatus: (body.approvalStatus || "PENDING") as PrismaApprovalStatus,
        },
      });

      if (body.products) {
        await syncProducts(projectId, body.products, body.startDate || new Date().toISOString());
      }
    });

    const updated = await prisma.project.findUnique({
      where: { id: projectId },
      include: projectInclude,
    });

    if (!updated) {
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ data: toProjectResponse(updated) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? `No se pudo actualizar el proyecto: ${message}`
            : "No se pudo actualizar el proyecto",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const projectId = Number(id);

    await prisma.project.delete({ where: { id: projectId } });

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? `No se pudo eliminar el proyecto: ${message}`
            : "No se pudo eliminar el proyecto",
      },
      { status: 500 },
    );
  }
}
