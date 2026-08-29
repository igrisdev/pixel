import { Project } from "@/types";
import { DraftParticipant } from "./types";

// Reúne el equipo de todos los productos ya existentes de un proyecto, sin
// repetir integrantes, para sugerirlo al crear un producto nuevo. Así no hay
// que volver a elegir a todos a mano: basta con quitar a quienes no participaron.
export function suggestTeamFromProject(project: Project): DraftParticipant[] {
  const byMember = new Map<number, DraftParticipant>();

  for (const product of project.products || []) {
    for (const part of product.participations || []) {
      // Conservamos la primera aparición (y con ella el rol que ya tenía).
      if (byMember.has(part.memberId)) continue;

      byMember.set(part.memberId, {
        tempId: `suggested-${part.memberId}`,
        memberId: part.memberId,
        memberName: part.memberName,
        memberPhotoUrl: part.memberPhotoUrl || "",
        productRole: part.productRole,
        suggested: true,
      });
    }
  }

  return Array.from(byMember.values());
}
