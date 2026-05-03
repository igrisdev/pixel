import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Member, Competency, ProfessionalLink } from "@/types";

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

export async function GET() {
  try {
    const members = await prisma.member.findMany({
      include: memberInclude,
      orderBy: { fullName: "asc" },
    });

    return NextResponse.json({ data: members.map(toMemberResponse) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? `No se pudieron cargar los integrantes: ${message}`
            : "No se pudieron cargar los integrantes",
      },
      { status: 500 },
    );
  }
}
