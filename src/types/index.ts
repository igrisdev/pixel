export type SystemRole = "ADMIN" | "MEMBER";
export type AcademicStatus = "STUDENT" | "GRADUATE";
export type ApprovalStatus = "PENDING" | "ACTIVE" | "REJECTED";
export type CategoryType = "DEVELOPMENT" | "EVENT" | "WRITING";

export interface ProfessionalLink {
  id: number;
  platform: string;
  url: string;
}

export interface Member {
  id: number;
  fullName: string;
  institutionalEmail: string;
  personalEmail: string;
  passwordHash: string;
  career: string;
  role: string; // Ej. "Frontend Developer"
  systemRole: SystemRole;
  academicStatus: AcademicStatus;
  tech: string[];
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
  memberName: string; // Desnormalizado para fácil acceso en UI
  memberPhotoUrl: string;
}

export interface AcademicProduct {
  id: number;
  projectId: number;
  title: string;
  description: string;
  categoryType: CategoryType;
  approvalStatus: ApprovalStatus;
  technologies?: string[];
  repositoryUrl?: string;
  demoUrl?: string;
  publicationSource?: string;
  documentUrl?: string;
  location?: string;
  participations?: Participation[];
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
}

export interface Competency {
  id: number;
  name: string;
  description: string;
  type: "TECHNICAL" | "SOFT";
}
