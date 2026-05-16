import { beforeEach, describe, expect, it, vi } from "vitest";

const { findFirstMock, compareMock } = vi.hoisted(() => ({
  findFirstMock: vi.fn(),
  compareMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    member: {
      findFirst: findFirstMock,
    },
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    compare: compareMock,
  },
}));

import { POST } from "@/app/api/auth/login/route";

function buildRequest(body: unknown): Request {
  return new Request("http://localhost/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when member does not exist", async () => {
    findFirstMock.mockResolvedValueOnce(null);

    const response = await POST(
      buildRequest({ email: "no@unimayor.edu.co", password: "x" }),
    );
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.error).toBe("Credenciales inválidas");
  });

  it("returns 401 when member is banned", async () => {
    findFirstMock.mockResolvedValueOnce({
      id: 2,
      fullName: "Banned",
      institutionalEmail: "banned@unimayor.edu.co",
      personalEmail: "",
      passwordHash: "hash",
      professionalProfile: "",
      career: "Ing",
      role: "Integrante",
      systemRole: "MEMBER",
      academicStatus: "STUDENT",
      competencies: [],
      photoUrl: "",
      isBanned: true,
      cvUrl: "",
      links: [],
    });

    const response = await POST(
      buildRequest({ email: "banned@unimayor.edu.co", password: "x" }),
    );
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.error).toBe("Usuario banned");
  });

  it("returns 401 when password is invalid", async () => {
    findFirstMock.mockResolvedValueOnce({
      id: 1,
      fullName: "Admin",
      institutionalEmail: "admin@unimayor.edu.co",
      personalEmail: "",
      passwordHash: "hash",
      professionalProfile: "",
      career: "Ing",
      role: "Coordinador",
      systemRole: "ADMIN",
      academicStatus: "GRADUATE",
      competencies: [],
      photoUrl: "",
      isBanned: false,
      cvUrl: "",
      links: [],
    });
    compareMock.mockResolvedValueOnce(false);

    const response = await POST(
      buildRequest({ email: "admin@unimayor.edu.co", password: "bad" }),
    );
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.error).toBe("Credenciales inválidas");
  });

  it("returns member data when credentials are valid", async () => {
    findFirstMock.mockResolvedValueOnce({
      id: 1,
      fullName: "Admin",
      institutionalEmail: "admin@unimayor.edu.co",
      personalEmail: "",
      passwordHash: "hash",
      professionalProfile: "",
      career: "Ing",
      role: "Coordinador",
      systemRole: "ADMIN",
      academicStatus: "GRADUATE",
      competencies: [],
      photoUrl: "",
      isBanned: false,
      cvUrl: "",
      links: [],
    });
    compareMock.mockResolvedValueOnce(true);

    const response = await POST(
      buildRequest({ email: "admin@unimayor.edu.co", password: "admin123" }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.data.institutionalEmail).toBe("admin@unimayor.edu.co");
    expect(payload.data.passwordHash).toBe("");
  });

  it("returns 500 for invalid request body", async () => {
    const response = await POST(buildRequest({ email: "invalid", password: "" }));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload.error).toBeTypeOf("string");
  });
});
