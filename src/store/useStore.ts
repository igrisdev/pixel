import { create } from "zustand";
import { Student, Project, Competency } from "../types"; // Ajusta la ruta si es necesario
import {
  INITIAL_STUDENTS,
  INITIAL_PROJECTS,
  INITIAL_COMPETENCIES,
} from "../data/mock"; // Ajusta la ruta si es necesario

// Tipos para la autenticación
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

  // --- ESTADO DE AUTENTICACIÓN ---
  currentUser: CurrentUser | null;

  // --- ACCIONES DE AUTENTICACIÓN ---
  login: (email: string, pass: string) => boolean;
  logout: () => void;

  // --- ACCIONES DE DATOS (Setters Básicos) ---
  setStudents: (students: Student[]) => void;
  setProjects: (projects: Project[]) => void;
  setCompetencies: (competencies: Competency[]) => void;

  // --- ACCIONES DE DATOS (CRUDs Dashboard - Fase 5) ---
  addProject: (project: Project) => void;
  updateProject: (id: number, project: Partial<Project>) => void;
  deleteProject: (id: number) => void;
  updateStudent: (id: number, student: Partial<Student>) => void;
}

export const useStore = create<StoreState>((set) => ({
  // 1. Inicializamos con tu data mockeada limpia
  students: INITIAL_STUDENTS,
  projects: INITIAL_PROJECTS,
  competencies: INITIAL_COMPETENCIES,
  currentUser: null,

  // 2. Lógica de Autenticación (Adaptada para el formulario de Login)
  login: (email, pass) => {
    // Lógica MOCK de autenticación
    if (email === "admin@unimayor.edu.co" && pass === "admin123") {
      set({ currentUser: { id: 2, name: "Admin User", role: "ADMIN", email } });
      return true;
    }
    if (email === "johan@gmail.com" && pass === "est123") {
      set({
        currentUser: {
          id: 1,
          name: "Johan Alvarez",
          role: "INTEGRANTE",
          email,
        },
      });
      return true;
    }
    return false;
  },

  logout: () => set({ currentUser: null }),

  // 3. Setters Básicos
  setStudents: (students) => set({ students }),
  setProjects: (projects) => set({ projects }),
  setCompetencies: (competencies) => set({ competencies }),

  // 4. Funciones CRUD para el Dashboard
  addProject: (project) =>
    set((state) => ({
      projects: [...state.projects, project],
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
}));
