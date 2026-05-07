import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Member, Competency, ProfessionalLink } from "@/types";
import type { Prisma } from "@/generated/client";

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
    passwordHash: member.passwordHash,
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

    const body = await request.json();

    const member = await prisma.member.update({
      where: { id: memberId },
      data: {
        ...(body.fullName && { fullName: body.fullName }),
        ...(body.institutionalEmail && { institutionalEmail: body.institutionalEmail }),
        ...(body.personalEmail !== undefined && { personalEmail: body.personalEmail }),
        ...(body.passwordHash && { passwordHash: body.passwordHash }),
        ...(body.professionalProfile !== undefined && { professionalProfile: body.professionalProfile }),
        ...(body.career && { career: body.career }),
        ...(body.role && { role: body.role }),
        ...(body.systemRole && { systemRole: body.systemRole }),
        ...(body.academicStatus && { academicStatus: body.academicStatus }),
        ...(body.photoUrl !== undefined && { photoUrl: body.photoUrl }),
        ...(body.isBanned !== undefined && { isBanned: body.isBanned }),
        ...(body.cvUrl !== undefined && { cvUrl: body.cvUrl }),
      },
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

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
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
