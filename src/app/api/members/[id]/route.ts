import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { Member, Competency, ProfessionalLink } from "@/types";
import type { Prisma } from "@/generated/client";
import { updateMemberSchema } from "@/lib/validations";
import { requireAdmin, requireSelfOrAdmin } from "@/lib/auth";

const memberInclude = {
  competencies: true,
  links: true,
} as const;

type MemberWithRelations = Prisma.MemberGetPayload<{ include: typeof memberInclude }>;

function toMemberResponse(member: MemberWithRelations): Member {
  return {
    id: member.id,
    fullName: member.fullName,
    institutionalEmail: member.institutionalEmail,
    personalEmail: member.personalEmail ?? "",
    passwordHash: "", // Nunca exponer el hash de contraseña al cliente.
    professionalProfile: member.professionalProfile ?? "",
    career: member.career,
    role: member.role,
    systemRole: member.systemRole,
    academicStatus: member.academicStatus,
    competencies: (member.competencies || []).map(
      (competency): Competency => ({
        id: competency.id,
        name: competency.name,
        description: competency.description,
        type: competency.type,
      }),
    ),
    photoUrl: member.photoUrl ?? "",
    isBanned: member.isBanned,
    cvUrl: member.cvUrl ?? "",
    links: (member.links || []).map(
      (link): ProfessionalLink => ({
        id: link.id,
        platform: link.platform,
        url: link.url,
      }),
    ),
  };
}

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const memberId = Number(id);

    const member = await prisma.member.findUnique({
      where: { id: memberId },
      include: memberInclude,
    });

    if (!member) {
      return NextResponse.json({ error: "Integrante no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ data: toMemberResponse(member) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? `No se pudo cargar el integrante: ${message}`
            : "No se pudo cargar el integrante",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const memberId = Number(id);

    const auth = await requireSelfOrAdmin(request, memberId);
    if (auth.error) return auth.error;
    const isAdmin = auth.session.role === "ADMIN";

    const body = updateMemberSchema.parse(await request.json());

    // Solo un admin puede cambiar el rol de sistema o el estado de baneo:
    // evita escalada de privilegios de un usuario editando su propio perfil.
    if (!isAdmin) {
      delete body.systemRole;
      delete body.isBanned;
    }

    const updateData: Record<string, unknown> = {
      ...(body.fullName && { fullName: body.fullName }),
      ...(body.institutionalEmail && { institutionalEmail: body.institutionalEmail }),
      ...(body.personalEmail !== undefined && { personalEmail: body.personalEmail }),
      ...(body.professionalProfile !== undefined && { professionalProfile: body.professionalProfile }),
      ...(body.career && { career: body.career }),
      ...(body.role && { role: body.role }),
      ...(body.systemRole && { systemRole: body.systemRole }),
      ...(body.academicStatus && { academicStatus: body.academicStatus }),
      ...(body.photoUrl !== undefined && { photoUrl: body.photoUrl as string }),
      ...(body.isBanned !== undefined && { isBanned: body.isBanned }),
      ...(body.cvUrl !== undefined && { cvUrl: body.cvUrl as string }),
    };

    if (body.passwordHash) {
      updateData.passwordHash = await bcrypt.hash(body.passwordHash, 10);
    }

    const member = await prisma.member.update({
      where: { id: memberId },
      data: updateData,
      include: memberInclude,
    });

    return NextResponse.json({ data: toMemberResponse(member) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? `No se pudo actualizar el integrante: ${message}`
            : "No se pudo actualizar el integrante",
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
    const memberId = Number(id);

    await prisma.member.delete({
      where: { id: memberId },
    });

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? `No se pudo eliminar el integrante: ${message}`
            : "No se pudo eliminar el integrante",
      },
      { status: 500 },
    );
  }
}
