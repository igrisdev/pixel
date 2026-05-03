import { CategoryType } from "@/types";

export type DraftParticipant = {
  tempId: string;
  memberId: number;
  memberName: string;
  memberPhotoUrl: string;
  productRole: string;
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
  repositoryUrl: string;
  demoUrl: string;
  publicationSource: string;
  documentUrl: string;
  location: string;
};
