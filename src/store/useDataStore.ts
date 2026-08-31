import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Member, Project, Competency, ProjectPayload } from "@/types";
import { ApiRepository, CreateProductPayload } from "@/services/api";

interface DataState {
  members: Member[];
  projects: Project[];
  competencies: Competency[];
  participatedProjects: Project[];

  setMembers: (members: Member[]) => void;
  setProjects: (projects: Project[]) => void;
  setCompetencies: (competencies: Competency[]) => void;
  setParticipatedProjects: (projects: Project[]) => void;
  loadMembers: () => Promise<void>;
  loadCompetencies: () => Promise<void>;
  loadProjects: (createdBy?: number) => Promise<void>;
  loadParticipatedProjects: (memberId: number) => Promise<void>;

  addProductToProject: (projectId: number, payload: CreateProductPayload) => Promise<void>;
  updateOwnProduct: (projectId: number, productId: number, payload: CreateProductPayload) => Promise<void>;

  addProject: (project: ProjectPayload) => Promise<void>;
  updateProject: (id: number, project: ProjectPayload) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;

  updateMember: (id: number, member: Partial<Member>) => Promise<void>;
  deleteMember: (id: number) => Promise<void>;
  createMember: (member: Partial<Member>) => Promise<void>;

  createCompetency: (competency: Partial<Competency>) => Promise<void>;
  updateCompetency: (id: number, competency: Partial<Competency>) => Promise<void>;
  deleteCompetency: (id: number) => Promise<void>;
}

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      members: [],
      projects: [],
      competencies: [],
      participatedProjects: [],

      setMembers: (members) => set({ members }),
      setProjects: (projects) => set({ projects }),
      setCompetencies: (competencies) => set({ competencies }),
      setParticipatedProjects: (projects) => set({ participatedProjects: projects }),

      loadMembers: async () => {
        const members = await ApiRepository.getMembers();
        set({ members });
      },

      loadCompetencies: async () => {
        const competencies = await ApiRepository.getCompetencies();
        set({ competencies });
      },

      loadProjects: async (createdBy) => {
        const projects = await ApiRepository.getProjects(createdBy);
        set({ projects });
      },

      loadParticipatedProjects: async (memberId) => {
        const projects = await ApiRepository.getProjectsByParticipation(memberId);
        set({ participatedProjects: projects });
      },

      addProductToProject: async (projectId, payload) => {
        await ApiRepository.createProductForProject(projectId, payload);
        // Recargamos las participaciones del solicitante para reflejar el nuevo producto.
        const projects = await ApiRepository.getProjectsByParticipation(payload.requesterId);
        set({ participatedProjects: projects });
      },

      updateOwnProduct: async (projectId, productId, payload) => {
        await ApiRepository.updateOwnProduct(projectId, productId, payload);
        const projects = await ApiRepository.getProjectsByParticipation(payload.requesterId);
        set({ participatedProjects: projects });
      },

      addProject: async (project) => {
        const newProject = await ApiRepository.createProject(project); // Deberías renombrarlo en la API a createProject luego
        set((state) => ({
          projects: [newProject, ...state.projects],
        }));
      },

      updateProject: async (id, updatedData) => {
        const updatedProject = await ApiRepository.updateProject(id, updatedData);
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? updatedProject : p,
          ),
        }));
      },

      deleteProject: async (id) => {
        await ApiRepository.deleteProject(id);
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        }));
      },

      updateMember: async (id, updatedData) => {
        const updatedMember = await ApiRepository.updateMember(id, updatedData);
        set((state) => ({
          members: state.members.map((m) =>
            m.id === id ? { ...m, ...updatedMember } : m,
          ),
        }));
      },

      deleteMember: async (id) => {
        await ApiRepository.deleteMember(id);
        set((state) => ({
          members: state.members.filter((m) => m.id !== id),
        }));
      },

      createMember: async (memberData) => {
        const newMember = await ApiRepository.createMember(memberData);
        set((state) => ({
          members: [...state.members, newMember],
        }));
      },

      createCompetency: async (competencyData) => {
        const newCompetency = await ApiRepository.createCompetency(competencyData);
        set((state) => ({
          competencies: [newCompetency, ...state.competencies],
        }));
      },

      updateCompetency: async (id, updatedData) => {
        const updatedCompetency = await ApiRepository.updateCompetency(id, updatedData);
        set((state) => ({
          competencies: state.competencies.map((c) =>
            c.id === id ? updatedCompetency : c,
          ),
        }));
      },

      deleteCompetency: async (id) => {
        await ApiRepository.deleteCompetency(id);
        set((state) => ({
          competencies: state.competencies.filter((c) => c.id !== id),
        }));
      },
    }),
    {
      name: "pixel-data-storage",
    },
  ),
);
