import { prisma } from "@/lib/prisma";

// Verifica que el integrante exista. Antes creaba cuentas automáticamente con
// una contraseña conocida ("temporal123"), lo que permitía generar cuentas
// funcionales pasando IDs arbitrarios. Ahora solo valida: si no existe, lanza
// un error y la operación se rechaza.
export async function ensureMemberExists(memberId: number) {
  const existing = await prisma.member.findUnique({
    where: { id: memberId },
    select: { id: true },
  });

  if (!existing) {
    throw new Error(`El integrante con id ${memberId} no existe.`);
  }
}
