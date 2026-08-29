import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureMemberExists } from "@/lib/member-provision";
import { createProductSchema, zodErrorMessage } from "@/lib/validations";
import { requireAuth } from "@/lib/auth";
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
    createdBy: prod.createdBy ?? undefined,
    technologies: Array.isArray(prod.technologies) ? (prod.technologies as string[]) : undefined,
    images: Array.isArray(prod.images) ? (prod.images as string[]) : undefined,
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

// PUT: el creador de un producto edita SOLO ese producto (no el proyecto).
// Al editar, el producto vuelve a estado PENDING para nueva aprobación.
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string; productId: string }> },
) {
  try {
    const { id, productId: productIdParam } = await context.params;
    const projectId = Number(id);
    const productId = Number(productIdParam);

    const auth = await requireAuth(request);
    if (auth.error) return auth.error;

    const body = createProductSchema.parse(await request.json());
    // El solicitante se toma de la sesión, no del body (no falsificable).
    const requesterId = auth.session.userId;

    const product = await prisma.academicProduct.findUnique({
      where: { id: productId },
      select: { id: true, projectId: true, createdBy: true },
    });

    if (!product || product.projectId !== projectId) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    // Autorización: solo el creador del producto puede editarlo.
    if (product.createdBy !== requesterId) {
      return NextResponse.json(
        { error: "Solo puedes editar los productos que tú creaste." },
        { status: 403 },
      );
    }

    // El creador siempre permanece como participante.
    const participationsInput = [...(body.participations || [])];
    if (!participationsInput.some((p) => p.memberId === requesterId)) {
      participationsInput.unshift({
        memberId: requesterId,
        productRole: "Autor",
        startDate: undefined,
        endDate: undefined,
      });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { startDate: true },
    });
    const projectStart = project?.startDate?.toISOString() || new Date().toISOString();

    await Promise.all(participationsInput.map((p) => ensureMemberExists(p.memberId)));

    await prisma.$transaction(async (tx) => {
      await tx.academicProduct.update({
        where: { id: productId },
        data: {
          title: body.title,
          description: body.description,
          categoryType: body.categoryType,
          approvalStatus: "PENDING",
          technologies: body.technologies && body.technologies.length > 0 ? body.technologies : undefined,
          // Un array vacío sí se guarda: permite quitar todas las imágenes.
          images: body.images,
          repositoryUrl: body.repositoryUrl || null,
          demoUrl: body.demoUrl || null,
          publicationSource: body.publicationSource || null,
          documentUrl: body.documentUrl || null,
          location: body.location || null,
        },
      });

      // Sincronizamos el equipo: reemplazamos las participaciones por las nuevas.
      await tx.participation.deleteMany({ where: { productId } });
      await tx.participation.createMany({
        data: participationsInput.map((p) => ({
          productId,
          memberId: p.memberId,
          productRole: p.productRole,
          startDate: p.startDate ? new Date(p.startDate) : new Date(projectStart),
          endDate: p.endDate ? new Date(p.endDate) : null,
        })),
      });
    });

    const updated = await prisma.academicProduct.findUnique({
      where: { id: productId },
      include: productInclude,
    });

    return NextResponse.json({ data: updated ? toProductResponse(updated) : null });
  } catch (error) {
    const invalid = zodErrorMessage(error);
    if (invalid) {
      return NextResponse.json({ error: invalid }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? `No se pudo actualizar el producto: ${message}`
            : "No se pudo actualizar el producto",
      },
      { status: 500 },
    );
  }
}
