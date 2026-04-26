import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Student, Proyecto, Competency } from "@/types";
import {
  INITIAL_STUDENTS,
  INITIAL_PROYECTOS,
  INITIAL_COMPETENCIES,
} from "@/data/mock";
import { ApiRepository } from "@/services/api"; // <-- Importamos nuestra API falsa

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
  proyectos: Proyecto[];
  competencies: Competency[];

  // --- ACCIONES GENERALES ---
  setStudents: (students: Student[]) => void;
  setProyectos: (proyectos: Proyecto[]) => void;
  setCompetencies: (competencies: Competency[]) => void;

  // --- ACCIONES CRUD PROYECTOS ---
  addProyecto: (proyecto: Proyecto) => Promise<void>;
  updateProyecto: (id: number, proyecto: Partial<Proyecto>) => Promise<void>;
  deleteProyecto: (id: number) => Promise<void>;

  // --- ACCIONES CRUD ESTUDIANTES ---
  updateStudent: (id: number, student: Partial<Student>) => Promise<void>;

  // --- ESTADO DE AUTENTICACIÓN ---
  currentUser: CurrentUser | null;
  userRole: UserRole | null;

  // --- ACCIONES DE AUTENTICACIÓN ---
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // 1. Inicializamos con la data mockeada.
      // NOTA: Gracias a 'persist', si ya hay datos en localStorage, ignorará estos MOCKS iniciales.
      students: INITIAL_STUDENTS,
      proyectos: INITIAL_PROYECTOS,
      competencies: INITIAL_COMPETENCIES,

      setStudents: (students) => set({ students }),
      setProyectos: (proyectos) => set({ proyectos }),
      setCompetencies: (competencies) => set({ competencies }),

      // 2. Acciones CRUD utilizando el REPOSITORIO (ApiRepository)
      addProyecto: async (proyecto) => {
        // Simulamos la llamada a la base de datos
        const nuevoProyecto = await ApiRepository.createProyecto(proyecto);

        set((state) => ({
          proyectos: [nuevoProyecto, ...state.proyectos],
        }));
      },

      updateProyecto: async (id, updatedData) => {
        // Simulamos la actualización en la base de datos
        await ApiRepository.updateProyecto(id, updatedData);

        set((state) => ({
          proyectos: state.proyectos.map((p) =>
            p.id === id ? { ...p, ...updatedData } : p,
          ),
        }));
      },

      deleteProyecto: async (id) => {
        // Simulamos el borrado en la base de datos
        await ApiRepository.deleteProyecto(id);

        set((state) => ({
          proyectos: state.proyectos.filter((p) => p.id !== id),
        }));
      },

      updateStudent: async (id, updatedData) => {
        // Simulamos la actualización del estudiante en la base de datos
        await ApiRepository.updateStudent(id, updatedData);

        set((state) => ({
          students: state.students.map((s) =>
            s.id === id ? { ...s, ...updatedData } : s,
          ),
        }));
      },

      // 3. Auth State
      currentUser: null,
      userRole: null,

      login: async (email, pass) => {
        // Simulamos el tiempo de validación de credenciales en el servidor
        await ApiRepository.verifyCredentials();

        // Lógica de administrador
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

        const state = get();
        // Buscamos al estudiante por correo institucional o personal
        const user = state.students.find(
          (s) => s.email_institucional === email || s.email_personal === email,
        );

        // Comparamos contra la contraseña guardada en el perfil del usuario (password_hash)
        if (user && pass === user.password_hash) {
          set({
            currentUser: {
              id: user.id,
              name: user.name,
              role: "INTEGRANTE",
              email,
            },
            userRole: "INTEGRANTE",
          });
          return true;
        }

        return false;
      },

      logout: () => {
        set({ currentUser: null, userRole: null });
      },
    }),
    {
      name: "pixel-storage", // Nombre de la clave en el localStorage
    },
  ),
);
