import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "@/store/useAuthStore";
import { ApiRepository } from "@/services/api";
import { Member } from "@/types";

vi.mock("@/services/api", () => ({
  ApiRepository: {
    login: vi.fn(),
  },
}));

function buildMember(overrides: Partial<Member> = {}): Member {
  return {
    id: 1,
    fullName: "Admin User",
    institutionalEmail: "admin@unimayor.edu.co",
    personalEmail: "",
    passwordHash: "hash",
    professionalProfile: "",
    career: "Ingenieria",
    role: "Coordinador",
    systemRole: "ADMIN",
    academicStatus: "GRADUATE",
    competencies: [],
    photoUrl: "",
    isBanned: false,
    cvUrl: "",
    links: [],
    ...overrides,
  };
}

describe("useAuthStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.removeItem("pixel-auth-storage");
    useAuthStore.setState({ currentUser: null, userRole: null, currentMember: null });
  });

  it("sets current user on successful login", async () => {
    const member = buildMember();
    vi.mocked(ApiRepository.login).mockResolvedValueOnce(member);

    const success = await useAuthStore
      .getState()
      .login("admin@unimayor.edu.co", "admin123");

    expect(success).toBe(true);
    expect(useAuthStore.getState().currentUser).toEqual({
      id: member.id,
      name: member.fullName,
      role: member.systemRole,
      email: member.institutionalEmail,
    });
    expect(useAuthStore.getState().currentMember?.id).toBe(member.id);
  });

  it("rejects banned users", async () => {
    vi.mocked(ApiRepository.login).mockResolvedValueOnce(
      buildMember({ isBanned: true }),
    );

    const success = await useAuthStore.getState().login("member@mail.com", "123");

    expect(success).toBe(false);
    expect(useAuthStore.getState().currentUser).toBeNull();
  });

  it("returns false when repository throws", async () => {
    vi.mocked(ApiRepository.login).mockRejectedValueOnce(new Error("failed"));

    const success = await useAuthStore.getState().login("bad@mail.com", "bad");

    expect(success).toBe(false);
    expect(useAuthStore.getState().currentUser).toBeNull();
  });

  it("clears session on logout", () => {
    const member = buildMember();
    useAuthStore.setState({
      currentUser: {
        id: member.id,
        name: member.fullName,
        role: member.systemRole,
        email: member.institutionalEmail,
      },
      userRole: member.systemRole,
      currentMember: member,
    });

    useAuthStore.getState().logout();

    expect(useAuthStore.getState().currentUser).toBeNull();
    expect(useAuthStore.getState().userRole).toBeNull();
    expect(useAuthStore.getState().currentMember).toBeNull();
  });
});
