import { create } from "zustand";
import { Student, Project, Competency, User } from "../types";
import {
  INITIAL_STUDENTS,
  INITIAL_PROJECTS,
  INITIAL_COMPETENCIES,
} from "../data/mock";

interface StoreState {
  // --- ESTADO DE DATOS ---
  students: Student[];
  projects: Project[];
  competencies: Competency[];

  // --- ACCIONES DE DATOS ---
  setStudents: (students: Student[]) => void;
  setProjects: (projects: Project[]) => void;
  setCompetencies: (competencies: Competency[]) => void;

  // --- ESTADO DE AUTENTICACIÓN ---
  currentUser: User | null;
  userRole: "ADMIN" | "INTEGRANTE" | null;

  // --- ACCIONES DE AUTENTICACIÓN ---
  login: (user: User, role: "ADMIN" | "INTEGRANTE") => void;
  logout: () => void;
}

export const useStore = create<StoreState>((set) => ({
  // Inicializamos con la data mockeada de la Fase 1
  students: INITIAL_STUDENTS,
  projects: INITIAL_PROJECTS,
  competencies: INITIAL_COMPETENCIES,

  setStudents: (students) => set({ students }),
  setProjects: (projects) => set({ projects }),
  setCompetencies: (competencies) => set({ competencies }),

  // Auth State
  currentUser: null,
  userRole: null,

  login: (user, role) => set({ currentUser: user, userRole: role }),
  logout: () => set({ currentUser: null, userRole: null }),
}));
