import { Project, Member, Competency, AcademicProduct } from "@/types";

export interface CreateProductPayload {
  requesterId: number;
  title: string;
  description: string;
  categoryType: string;
  technologies?: string[];
  repositoryUrl?: string;
  demoUrl?: string;
  publicationSource?: string;
  documentUrl?: string;
  location?: string;
  participations?: { memberId: number; productRole: string }[];
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.error || "Error de API");
  }

  return payload.data as T;
}

export const ApiRepository = {
  getMembers: async (): Promise<Member[]> => {
    return request<Member[]>("/api/members");
  },

  getMemberById: async (id: number): Promise<Member> => {
    return request<Member>(`/api/members/${id}`);
  },

  getCompetencies: async (): Promise<Competency[]> => {
    return request<Competency[]>("/api/competencies");
  },

  // --- COMPETENCIAS ---
  createCompetency: async (competency: Partial<Competency>): Promise<Competency> => {
    return request<Competency>("/api/competencies", {
      method: "POST",
      body: JSON.stringify(competency),
    });
  },

  updateCompetency: async (id: number, data: Partial<Competency>): Promise<Competency> => {
    return request<Competency>(`/api/competencies/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteCompetency: async (id: number): Promise<void> => {
    await request<{ success: boolean }>(`/api/competencies/${id}`, {
      method: "DELETE",
    });
  },

  getProjects: async (createdBy?: number): Promise<Project[]> => {
    const query = createdBy ? `?createdBy=${createdBy}` : "";
    return request<Project[]>(`/api/projects${query}`);
  },

  getProjectsByParticipation: async (memberId: number): Promise<Project[]> => {
    return request<Project[]>(`/api/projects?participatedBy=${memberId}`);
  },

  // --- PROYECTOS ---
  createProject: async (project: Project): Promise<Project> => {
    return request<Project>("/api/projects", {
      method: "POST",
      body: JSON.stringify(project),
    });
  },

  updateProject: async (id: number, data: Partial<Project>): Promise<Project> => {
    return request<Project>(`/api/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteProject: async (id: number): Promise<void> => {
    await request<{ success: boolean }>(`/api/projects/${id}`, {
      method: "DELETE",
    });
  },

  // --- PRODUCTOS ---
  // Un integrante agrega un producto interno a un proyecto en el que participa.
  createProductForProject: async (
    projectId: number,
    payload: CreateProductPayload,
  ): Promise<AcademicProduct> => {
    return request<AcademicProduct>(`/api/projects/${projectId}/products`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Editar un producto propio (solo el creador). Reusa el mismo payload.
  updateOwnProduct: async (
    projectId: number,
    productId: number,
    payload: CreateProductPayload,
  ): Promise<AcademicProduct> => {
    return request<AcademicProduct>(`/api/projects/${projectId}/products/${productId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  // --- MIEMBROS / USUARIOS ---
  updateMember: async (id: number, data: Partial<Member>): Promise<Member> => {
    return request<Member>(`/api/members/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // --- LINKS ---
  addLink: async (memberId: number, platform: string, url: string) => {
    return request<{ id: number; platform: string; url: string }>(
      `/api/members/${memberId}/links`,
      { method: "POST", body: JSON.stringify({ platform, url }) },
    );
  },

  updateLink: async (memberId: number, linkId: number, data: { platform: string; url: string }) => {
    return request<{ id: number; platform: string; url: string }>(
      `/api/members/${memberId}/links?linkId=${linkId}`,
      { method: "PUT", body: JSON.stringify(data) },
    );
  },

  deleteLink: async (memberId: number, linkId: number) => {
    return request<{ success: boolean }>(
      `/api/members/${memberId}/links?linkId=${linkId}`,
      { method: "DELETE" },
    );
  },

  // --- COMPETENCIAS DE MIEMBRO ---
  updateMemberCompetencies: async (memberId: number, competencyIds: number[]) => {
    return request<{ id: number; name: string; description: string; type: string }[]>(
      `/api/members/${memberId}/competencies`,
      { method: "PUT", body: JSON.stringify({ competencyIds }) },
    );
  },

  deleteMember: async (id: number): Promise<void> => {
    await request<{ success: boolean }>(`/api/members/${id}`, {
      method: "DELETE",
    });
  },

  createMember: async (member: Partial<Member>): Promise<Member> => {
    return request<Member>("/api/members", {
      method: "POST",
      body: JSON.stringify(member),
    });
  },

  // --- AUTH ---
  verifyCredentials: async (): Promise<void> => {
    return Promise.resolve();
  },

  login: async (email: string, password: string): Promise<Member> => {
    return request<Member>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  // --- UPLOAD ---
  uploadFile: async (file: File, type: string): Promise<{ url: string; fileName: string; type: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload?.error || "Error al subir el archivo");
    }

    return payload.data;
  },
};
