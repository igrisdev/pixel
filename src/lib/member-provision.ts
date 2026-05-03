import { prisma } from "@/lib/prisma";

export async function ensureMemberExists(memberId: number) {
  const existing = await prisma.member.findUnique({
    where: { id: memberId },
    select: { id: true },
  });

  if (existing) return;

  await prisma.member.create({
    data: {
      id: memberId,
      fullName: `Integrante ${memberId}`,
      institutionalEmail: `member${memberId}@pixel.local`,
      personalEmail: null,
      passwordHash: "temporal123",
      professionalProfile: "Perfil temporal creado automáticamente para mantener integridad referencial.",
      career: "Sin definir",
      role: "Sin definir",
      systemRole: "MEMBER",
      academicStatus: "STUDENT",
      photoUrl: null,
      isBanned: false,
      cvUrl: null,
    },
  });
}
