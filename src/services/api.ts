import { Proyecto, Student } from "@/types";

// Utilidad para simular latencia de red (Backend falso)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const ApiRepository = {
  // --- PROYECTOS ---
  createProyecto: async (proyecto: Proyecto): Promise<Proyecto> => {
    await delay(300); // Simulamos el POST a /api/proyectos
    return proyecto; // El "backend" nos devuelve el objeto creado
  },

  updateProyecto: async (
    id: number,
    data: Partial<Proyecto>,
  ): Promise<void> => {
    await delay(300); // Simulamos el PUT a /api/proyectos/[id]
    // No retorna nada, solo confirma que se actualizó
  },

  deleteProyecto: async (id: number): Promise<void> => {
    await delay(300); // Simulamos el DELETE a /api/proyectos/[id]
  },

  // --- ESTUDIANTES / USUARIOS ---
  updateStudent: async (id: number, data: Partial<Student>): Promise<void> => {
    await delay(300); // Simulamos el PUT a /api/students/[id]
  },

  // --- AUTH ---
  verifyCredentials: async (): Promise<void> => {
    await delay(500); // Simulamos la consulta a la BD para verificar el hash
  },
};
