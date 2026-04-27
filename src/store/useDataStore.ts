import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Member, Project, Competency } from "@/types";
import {
  INITIAL_MEMBERS,
  INITIAL_PROJECTS,
  INITIAL_COMPETENCIES,
} from "@/data/mock";
import { ApiRepository } from "@/services/api";

interface DataState {
  members: Member[];
  projects: Project[];
  competencies: Competency[];

  setMembers: (members: Member[]) => void;
  setProjects: (projects: Project[]) => void;
  setCompetencies: (competencies: Competency[]) => void;

  addProject: (project: Project) => Promise<void>;
  updateProject: (id: number, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;

  updateMember: (id: number, member: Partial<Member>) => Promise<void>;
}

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      members: INITIAL_MEMBERS,
      projects: INITIAL_PROJECTS,
      competencies: INITIAL_COMPETENCIES,

      setMembers: (members) => set({ members }),
      setProjects: (projects) => set({ projects }),
      setCompetencies: (competencies) => set({ competencies }),

      addProject: async (project) => {
        const newProject = await ApiRepository.createProyecto(project); // Deberías renombrarlo en la API a createProject luego
        set((state) => ({
          projects: [newProject, ...state.projects],
        }));
      },

      updateProject: async (id, updatedData) => {
        await ApiRepository.updateProyecto(id, updatedData);
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updatedData } : p,
          ),
        }));
      },

      deleteProject: async (id) => {
        await ApiRepository.deleteProyecto(id);
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        }));
      },

      updateMember: async (id, updatedData) => {
        await ApiRepository.updateStudent(id, updatedData); // Cambiar en la API a updateMember
        set((state) => ({
          members: state.members.map((m) =>
            m.id === id ? { ...m, ...updatedData } : m,
          ),
        }));
      },
    }),
    {
      name: "pixel-data-storage", // <-- Guarda en un espacio distinto en localStorage
    },
  ),
);
