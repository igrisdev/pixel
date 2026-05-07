import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Member, Competency, ProfessionalLink } from "@/types";
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
    passwordHash: "",
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

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const member = await prisma.member.findFirst({
      where: { institutionalEmail: email },
      include: memberInclude,
    });

    if (!member) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    if (member.isBanned) {
      return NextResponse.json(
        { error: "Usuario banned" },
        { status: 401 }
      );
    }

    if (member.passwordHash !== password) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    return NextResponse.json({ data: toMemberResponse(member) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? `Error de autenticación: ${message}`
            : "Error de autenticación",
      },
      { status: 500 }
    );
  }
}