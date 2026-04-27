import { Project, Member } from "@/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const ApiRepository = {
  // --- PROYECTOS ---
  createProject: async (project: Project): Promise<Project> => {
    await delay(300); // Simulamos el POST a /api/projects
    return project; // El "backend" nos devuelve el objeto creado
  },

  updateProject: async (id: number, data: Partial<Project>): Promise<void> => {
    await delay(300); // Simulamos el PUT a /api/projects/[id]
  },

  deleteProject: async (id: number): Promise<void> => {
    await delay(300); // Simulamos el DELETE a /api/projects/[id]
  },

  // --- MIEMBROS / USUARIOS ---
  updateMember: async (id: number, data: Partial<Member>): Promise<void> => {
    await delay(300); // Simulamos el PUT a /api/members/[id]
  },

  // --- AUTH ---
  verifyCredentials: async (): Promise<void> => {
    await delay(500); // Simulamos la consulta a la BD para verificar el hash
  },
};
