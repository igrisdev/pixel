import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-error";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { Member, Competency, ProfessionalLink } from "@/types";
import type { Prisma } from "@/generated/client";
import { requireAdmin } from "@/lib/auth";
import { createMemberSchema } from "@/lib/validations";

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

export async function GET() {
  try {
    const members = await prisma.member.findMany({
      include: memberInclude,
      orderBy: { fullName: "asc" },
    });

    return NextResponse.json({ data: members.map(toMemberResponse) });
  } catch (error) {
    return apiError(error, "No se pudieron cargar los integrantes");
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;

    const body = createMemberSchema.parse(await request.json());
    const hashedPassword = await bcrypt.hash(body.passwordHash, 10);

    const member = await prisma.member.create({
      data: {
        fullName: body.fullName,
        institutionalEmail: body.institutionalEmail,
        personalEmail: body.personalEmail ?? "",
        passwordHash: hashedPassword,
        professionalProfile: body.professionalProfile ?? "",
        career: body.career,
        role: body.role ?? "Integrante",
        systemRole: body.systemRole,
        academicStatus: body.academicStatus,
        photoUrl: (body.photoUrl as string) ?? "",
        isBanned: false,
        cvUrl: (body.cvUrl as string) ?? "",
      },
      include: memberInclude,
    });

    return NextResponse.json({ data: toMemberResponse(member) }, { status: 201 });
  } catch (error) {
    return apiError(error, "No se pudo crear el integrante");
  }
}
