import { beforeEach, describe, expect, it, vi } from "vitest";

const { findManyMock, createMock, hashMock } = vi.hoisted(() => ({
  findManyMock: vi.fn(),
  createMock: vi.fn(),
  hashMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    member: {
      findMany: findManyMock,
      create: createMock,
    },
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: hashMock,
  },
}));

import { GET, POST } from "@/app/api/members/route";

function buildPostRequest(body: unknown): Request {
  return new Request("http://localhost/api/members", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function buildMember(id: number) {
  return {
    id,
    fullName: `Member ${id}`,
    institutionalEmail: `member${id}@unimayor.edu.co`,
    personalEmail: "",
    passwordHash: "hash",
    professionalProfile: "",
    career: "Ing",
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

describe("/api/members route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET returns members list", async () => {
    findManyMock.mockResolvedValueOnce([buildMember(1), buildMember(2)]);

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.data).toHaveLength(2);
    expect(findManyMock).toHaveBeenCalledOnce();
  });

  it("GET returns 500 when prisma fails", async () => {
    findManyMock.mockRejectedValueOnce(new Error("db fail"));

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload.error).toBeTypeOf("string");
  });

  it("POST creates member with hashed password", async () => {
    hashMock.mockResolvedValueOnce("hashed-password");
    createMock.mockResolvedValueOnce(buildMember(10));

    const response = await POST(
      buildPostRequest({
        fullName: "Nuevo Miembro",
        institutionalEmail: "nuevo@unimayor.edu.co",
        personalEmail: "",
        passwordHash: "plain123",
        professionalProfile: "",
        career: "Ing",
        role: "Integrante",
        systemRole: "MEMBER",
        academicStatus: "STUDENT",
        photoUrl: "",
        cvUrl: "",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.data.id).toBe(10);
    expect(hashMock).toHaveBeenCalledWith("plain123", 10);
    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          passwordHash: "hashed-password",
        }),
      }),
    );
  });

  it("POST returns 500 for invalid payload", async () => {
    const response = await POST(
      buildPostRequest({
        fullName: "",
        institutionalEmail: "not-an-email",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload.error).toBeTypeOf("string");
  });
});
