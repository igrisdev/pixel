import { create } from "zustand";
import { Student, Proyecto, Competency } from "@/types";
import {
  INITIAL_STUDENTS,
  INITIAL_PROYECTOS,
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
  proyectos: Proyecto[]; // <- Actualizado
  competencies: Competency[];

  // --- ACCIONES GENERALES ---
  setStudents: (students: Student[]) => void;
  setProyectos: (proyectos: Proyecto[]) => void; // <- Actualizado
  setCompetencies: (competencies: Competency[]) => void;

  // --- ACCIONES CRUD PROYECTOS ---
  addProyecto: (proyecto: Proyecto) => void;
  updateProyecto: (id: number, proyecto: Partial<Proyecto>) => void;
  deleteProyecto: (id: number) => void;

  // --- ACCIONES CRUD ESTUDIANTES ---
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
  proyectos: INITIAL_PROYECTOS, // <- Actualizado
  competencies: INITIAL_COMPETENCIES,

  setStudents: (students) => set({ students }),
  setProyectos: (proyectos) => set({ proyectos }),
  setCompetencies: (competencies) => set({ competencies }),

  // 2. Acciones CRUD
  addProyecto: (proyecto) =>
    set((state) => ({
      proyectos: [proyecto, ...state.proyectos],
    })),

  updateProyecto: (id, updatedData) =>
    set((state) => ({
      proyectos: state.proyectos.map((p) =>
        p.id === id ? { ...p, ...updatedData } : p,
      ),
    })),

  deleteProyecto: (id) =>
    set((state) => ({
      proyectos: state.proyectos.filter((p) => p.id !== id),
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
