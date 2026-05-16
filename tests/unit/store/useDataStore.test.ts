import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDataStore } from "@/store/useDataStore";
import { ApiRepository } from "@/services/api";
import { Competency, Member, Project } from "@/types";

vi.mock("@/services/api", () => ({
  ApiRepository: {
    getMembers: vi.fn(),
    getProjects: vi.fn(),
    getCompetencies: vi.fn(),
    createProject: vi.fn(),
    updateProject: vi.fn(),
    deleteProject: vi.fn(),
    updateMember: vi.fn(),
    deleteMember: vi.fn(),
    createMember: vi.fn(),
    createCompetency: vi.fn(),
    updateCompetency: vi.fn(),
    deleteCompetency: vi.fn(),
  },
}));

function buildMember(id: number): Member {
  return {
    id,
    fullName: `Member ${id}`,
    institutionalEmail: `member${id}@unimayor.edu.co`,
    personalEmail: "",
    passwordHash: "hash",
    professionalProfile: "",
    career: "Ingenieria",
    role: "Integrante",
    systemRole: "MEMBER",
    academicStatus: "STUDENT",
    competencies: [],
    photoUrl: "",
    isBanned: false,
    cvUrl: "",
    links: [],
  };
}

function buildProject(id: number): Project {
  return {
    id,
    title: `Proyecto ${id}`,
    objective: "Objetivo",
    startDate: "2026-01-01",
    createdBy: 1,
    coverImageUrl: "",
    approvalStatus: "PENDING",
    products: [],
  };
}

function buildCompetency(id: number): Competency {
  return {
    id,
    name: `Comp ${id}`,
    description: "Desc",
    type: "TECHNICAL",
  };
}

describe("useDataStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.removeItem("pixel-data-storage");
    useDataStore.setState({ members: [], projects: [], competencies: [] });
  });

  it("loads members from repository", async () => {
    const members = [buildMember(1), buildMember(2)];
    vi.mocked(ApiRepository.getMembers).mockResolvedValueOnce(members);

    await useDataStore.getState().loadMembers();

    expect(useDataStore.getState().members).toEqual(members);
  });

  it("adds a project at the top of the list", async () => {
    useDataStore.setState({ projects: [buildProject(1)] });
    const created = buildProject(9);
    vi.mocked(ApiRepository.createProject).mockResolvedValueOnce(created);

    await useDataStore.getState().addProject(created);

    expect(useDataStore.getState().projects[0].id).toBe(9);
    expect(useDataStore.getState().projects).toHaveLength(2);
  });

  it("updates an existing project", async () => {
    useDataStore.setState({ projects: [buildProject(1), buildProject(2)] });
    const updated = { ...buildProject(2), title: "Proyecto actualizado" };
    vi.mocked(ApiRepository.updateProject).mockResolvedValueOnce(updated);

    await useDataStore.getState().updateProject(2, { title: "Proyecto actualizado" });

    expect(useDataStore.getState().projects[1].title).toBe("Proyecto actualizado");
  });

  it("removes project after delete", async () => {
    useDataStore.setState({ projects: [buildProject(1), buildProject(2)] });
    vi.mocked(ApiRepository.deleteProject).mockResolvedValueOnce();

    await useDataStore.getState().deleteProject(1);

    expect(useDataStore.getState().projects).toHaveLength(1);
    expect(useDataStore.getState().projects[0].id).toBe(2);
  });

  it("creates and updates competencies", async () => {
    useDataStore.setState({ competencies: [buildCompetency(1)] });

    const created = buildCompetency(2);
    vi.mocked(ApiRepository.createCompetency).mockResolvedValueOnce(created);
    await useDataStore.getState().createCompetency(created);
    expect(useDataStore.getState().competencies[0].id).toBe(2);

    const updated = { ...created, name: "Comp actualizada" };
    vi.mocked(ApiRepository.updateCompetency).mockResolvedValueOnce(updated);
    await useDataStore.getState().updateCompetency(2, { name: "Comp actualizada" });
    expect(useDataStore.getState().competencies[0].name).toBe("Comp actualizada");
  });
});
