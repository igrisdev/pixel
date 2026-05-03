import { Project, Member, Competency } from "@/types";

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

  getProjects: async (createdBy?: number): Promise<Project[]> => {
    const query = createdBy ? `?createdBy=${createdBy}` : "";
    return request<Project[]>(`/api/projects${query}`);
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

  // --- MIEMBROS / USUARIOS ---
  updateMember: async (id: number, data: Partial<Member>): Promise<void> => {
    void id;
    void data;
    return Promise.resolve();
  },

  // --- AUTH ---
  verifyCredentials: async (): Promise<void> => {
    return Promise.resolve();
  },
};
