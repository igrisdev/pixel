import { prisma } from "@/lib/prisma";
import type { SessionPayload } from "@/lib/auth";

// Permisos de un usuario sobre un proyecto macro concreto.
export interface ProjectPermissions {
  exists: boolean;
  isCreator: boolean;
  isLeader: boolean;
  isCollaborator: boolean;
  isAdmin: boolean;
  // Editar título, fechas, portada, premios.
  canEditProject: boolean;
  // Eliminar el proyecto y todo lo que cuelga de él: solo creador y admin.
  canDeleteProject: boolean;
  // Añadir o quitar integrantes del equipo del proyecto.
  canManageTeam: boolean;
  // Aportar productos al proyecto.
  canAddProducts: boolean;
  // Editar o borrar CUALQUIER producto, no solo los propios.
  canManageAllProducts: boolean;
  // Cambiar el estado de aprobación: exclusivo de administradores.
  canApprove: boolean;
}

const NO_ACCESS: ProjectPermissions = {
  exists: false,
  isCreator: false,
  isLeader: false,
  isCollaborator: false,
  isAdmin: false,
  canEditProject: false,
  canDeleteProject: false,
  canManageTeam: false,
  canAddProducts: false,
  canManageAllProducts: false,
  canApprove: false,
};

export async function getProjectPermissions(
  projectId: number,
  session: SessionPayload,
): Promise<ProjectPermissions> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { createdBy: true },
  });

  if (!project) return NO_ACCESS;

  const isAdmin = session.role === "ADMIN";
  const isCreator = project.createdBy === session.userId;

  const membership = await prisma.projectMember.findUnique({
    where: { projectId_memberId: { projectId, memberId: session.userId } },
    select: { access: true },
  });

  const isLeader = membership?.access === "LEADER";
  const isCollaborator = membership?.access === "COLLABORATOR";

  // Quien participa en algún producto conserva el acceso que ya tenía antes
  // de que existiera el equipo de proyecto.
  const participation = await prisma.participation.findFirst({
    where: { memberId: session.userId, product: { projectId } },
    select: { id: true },
  });
  const isProductParticipant = Boolean(participation);

  return {
    exists: true,
    isCreator,
    isLeader,
    isCollaborator,
    isAdmin,
    canEditProject: isCreator || isAdmin || isLeader,
    canDeleteProject: isCreator || isAdmin,
    canManageTeam: isCreator || isAdmin || isLeader,
    canAddProducts:
      isCreator || isAdmin || isLeader || isCollaborator || isProductParticipant,
    canManageAllProducts: isCreator || isAdmin || isLeader,
    canApprove: isAdmin,
  };
}
