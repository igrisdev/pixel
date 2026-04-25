import { create } from "zustand";
import { Student, Project, Competency } from "@/types";
import {
  INITIAL_STUDENTS,
  INITIAL_PROJECTS,
  INITIAL_COMPETENCIES,
} from "@/data/mock";

export type UserRole = "ADMIN" | "INTEGRANTE";

export interface CurrentUser {
  id: number;
  name: string;
  role: UserRole;
  email: string;
}

interface StoreState {
  // --- ESTADO DE DATOS ---
  students: Student[];
  projects: Project[];
  competencies: Competency[];

  // --- ACCIONES GENERALES ---
  setStudents: (students: Student[]) => void;
  setProjects: (projects: Project[]) => void;
  setCompetencies: (competencies: Competency[]) => void;

  // --- ACCIONES CRUD ---
  addProject: (project: Project) => void;
  updateProject: (id: number, project: Partial<Project>) => void;
  deleteProject: (id: number) => void;
  updateStudent: (id: number, student: Partial<Student>) => void;

  // --- ESTADO DE AUTENTICACIÓN ---
  currentUser: CurrentUser | null;
  userRole: UserRole | null;

  // --- ACCIONES DE AUTENTICACIÓN ---
  login: (email: string, pass: string) => boolean;
  logout: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  // 1. Inicializamos con la data mockeada de la Fase 1
  students: INITIAL_STUDENTS,
  projects: INITIAL_PROJECTS,
  competencies: INITIAL_COMPETENCIES,

  setStudents: (students) => set({ students }),
  setProjects: (projects) => set({ projects }),
  setCompetencies: (competencies) => set({ competencies }),

  // 2. Acciones CRUD (Afectarán a toda la página instantáneamente)
  addProject: (project) =>
    set((state) => ({
      projects: [project, ...state.projects],
    })),

  updateProject: (id, updatedData) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updatedData } : p,
      ),
    })),

  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
    })),

  updateStudent: (id, updatedData) =>
    set((state) => ({
      students: state.students.map((s) =>
        s.id === id ? { ...s, ...updatedData } : s,
      ),
    })),

  // 3. Auth State
  currentUser: null,
  userRole: null,

  login: (email, pass) => {
    // Lógica MOCK de autenticación
    if (email === "admin@unimayor.edu.co" && pass === "admin123") {
      set({
        currentUser: {
          id: 999,
          name: "Administrador Pixel",
          role: "ADMIN",
          email,
        },
        userRole: "ADMIN",
      });
      return true;
    }

    // Vinculamos al estudiante de prueba (Johan - ID: 1)
    if (email === "johan@gmail.com" && pass === "est123") {
      const state = get();
      const johan = state.students.find((s) => s.id === 1);

      if (johan) {
        set({
          currentUser: {
            id: johan.id,
            name: johan.name,
            role: "INTEGRANTE",
            email,
          },
          userRole: "INTEGRANTE",
        });
        return true;
      }
    }
    return false;
  },

  logout: () => set({ currentUser: null, userRole: null }),
}));
