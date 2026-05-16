import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiRepository } from "@/services/api";

describe("ApiRepository", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns member from login endpoint", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          id: 1,
          fullName: "Admin",
          institutionalEmail: "admin@unimayor.edu.co",
          personalEmail: "",
          passwordHash: "",
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
        },
      }),
    } as Response);

    const member = await ApiRepository.login("admin@unimayor.edu.co", "admin123");

    expect(member.id).toBe(1);
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/auth/login",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("throws api error when response is not ok", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Credenciales invalidas" }),
    } as Response);

    await expect(ApiRepository.login("wrong@mail.com", "wrong")).rejects.toThrow(
      "Credenciales invalidas",
    );
  });
});
