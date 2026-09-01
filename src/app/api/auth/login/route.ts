import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-error";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Member, Competency, ProfessionalLink } from "@/types";
import type { Prisma } from "@/generated/client";
import { loginSchema } from "@/lib/validations";
import { attachSessionCookie } from "@/lib/auth";
import { hitRateLimit, resetRateLimit, getClientIp } from "@/lib/rate-limit";

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
    const { email, password } = loginSchema.parse(await request.json());

    // Rate limiting por IP + email: máximo 5 intentos cada 15 minutos.
    const rateKey = `login:${getClientIp(request)}:${email.toLowerCase()}`;
    const limit = await hitRateLimit(rateKey);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Demasiados intentos. Inténtalo más tarde." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
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

    const isValidPassword = await bcrypt.compare(password, member.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Login exitoso: limpiamos el contador de intentos de esta clave.
    await resetRateLimit(rateKey);

    // Emitimos la sesión firmada en una cookie httpOnly sobre la respuesta.
    const response = NextResponse.json({ data: toMemberResponse(member) });
    await attachSessionCookie(response, { userId: member.id, role: member.systemRole });
    return response;
  } catch (error) {
    return apiError(error, "Error de autenticación");
  }
}
