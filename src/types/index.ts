export type SystemRole = "ADMIN" | "MEMBER";
export type AcademicStatus = "STUDENT" | "GRADUATE";
export type ApprovalStatus = "PENDING" | "ACTIVE" | "REJECTED";
export type CategoryType = "DEVELOPMENT" | "EVENT" | "WRITING";
// Nivel de acceso de un integrante sobre un proyecto macro.
export type ProjectAccess = "LEADER" | "COLLABORATOR";
export type CompetencyType = "TECHNICAL" | "SOFT"; // "TECNICA" | "TRANSVERSAL"

export interface ProfessionalLink {
  id: number;
  platform: string;
  url: string;
}

export interface Competency {
  id: number;
  name: string;
  description: string;
  type: CompetencyType;
}

export interface Member {
  id: number;
  fullName: string;
  institutionalEmail: string;
  personalEmail: string;
  passwordHash: string;
  professionalProfile: string;
  career: string;
  role: string;
  systemRole: SystemRole;
  academicStatus: AcademicStatus;
  competencies: Competency[];
  photoUrl: string;
  isBanned: boolean;
  cvUrl: string;
  links: ProfessionalLink[];
}

export interface Participation {
  id: number;
  memberId: number;
  productId: number;
  productRole: string;
  startDate: string;
  endDate?: string;
  memberName: string;
  memberPhotoUrl: string;
  memberCareer?: string;
}

export interface AcademicProduct {
  id: number;
  projectId: number;
  title: string;
  description: string;
  categoryType: CategoryType;
  approvalStatus: ApprovalStatus;
  createdBy?: number;
  technologies?: string[];
  images?: string[];
  repositoryUrl?: string;
  demoUrl?: string;
  publicationSource?: string;
  documentUrl?: string;
  // Contexto opcional, disponible en cualquier categoría.
  city?: string;
  eventName?: string;
  venue?: string;
  startDate?: string;
  endDate?: string;
  participations?: Participation[];
}

// Integrante del equipo del proyecto (independiente de los productos).
export interface ProjectMemberEntry {
  id: number;
  memberId: number;
  access: ProjectAccess;
  memberName: string;
  memberPhotoUrl: string;
  memberCareer?: string;
}

// Lo que se ENVÍA al guardar el equipo (la respuesta trae además los datos
// del integrante, en ProjectMemberEntry).
export interface ProjectMemberInput {
  memberId: number;
  access: ProjectAccess;
}

export interface Project {
  id: number;
  title: string;
  objective: string;
  awards?: string;
  startDate: string;
  endDate?: string;
  createdBy: number;
  coverImageUrl: string;
  approvalStatus: ApprovalStatus;
  products?: AcademicProduct[];
  members?: ProjectMemberEntry[];
}

// Payload para crear o actualizar un proyecto: el equipo va en formato de
// entrada, no con los datos completos del integrante.
export type ProjectPayload = Omit<Partial<Project>, "members"> & {
  members?: ProjectMemberInput[];
};
