import { CategoryType } from "@/types";

export type DraftParticipant = {
  tempId: string;
  memberId: number;
  memberName: string;
  memberPhotoUrl: string;
  productRole: string;
  // Marca a quienes vienen sugeridos desde otros productos del proyecto.
  suggested?: boolean;
};

export type ProjectFormData = {
  title: string;
  objective: string;
  awards: string;
  startDate: string;
  endDate: string;
  coverImageUrl: string;
};

export type ProductFormData = {
  title: string;
  description: string;
  categoryType: CategoryType;
  technologiesString: string;
  images: string[];
  repositoryUrl: string;
  demoUrl: string;
  publicationSource: string;
  documentUrl: string;
  // Contexto opcional, común a todas las categorías.
  city: string;
  eventName: string;
  venue: string;
  startDate: string;
  endDate: string;
};
