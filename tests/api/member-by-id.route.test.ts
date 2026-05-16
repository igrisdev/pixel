import { beforeEach, describe, expect, it, vi } from "vitest";

const { findUniqueMock, updateMock, deleteMock, hashMock } = vi.hoisted(() => ({
  findUniqueMock: vi.fn(),
  updateMock: vi.fn(),
  deleteMock: vi.fn(),
  hashMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    member: {
      findUnique: findUniqueMock,
      update: updateMock,
      delete: deleteMock,
    },
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: hashMock,
  },
}));

import { DELETE, GET, PUT } from "@/app/api/members/[id]/route";

function context(id: string) {
  return { params: Promise.resolve({ id }) };
}

function buildRequest(body: unknown): Request {
  return new Request("http://localhost/api/members/1", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function buildMember(id = 1) {
  return {
    id,
    fullName: "Member",
    institutionalEmail: "member@unimayor.edu.co",
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

describe("/api/members/[id] route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET returns 404 when member does not exist", async () => {
    findUniqueMock.mockResolvedValueOnce(null);

    const response = await GET(new Request("http://localhost"), context("7"));
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload.error).toBe("Integrante no encontrado");
  });

  it("GET returns member when found", async () => {
    findUniqueMock.mockResolvedValueOnce(buildMember(7));

    const response = await GET(new Request("http://localhost"), context("7"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.data.id).toBe(7);
  });

  it("PUT updates member and hashes password when provided", async () => {
    hashMock.mockResolvedValueOnce("new-hash");
    updateMock.mockResolvedValueOnce(buildMember(3));

    const response = await PUT(
      buildRequest({ fullName: "Actualizado", passwordHash: "plain123" }),
      context("3"),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.data.id).toBe(3);
    expect(hashMock).toHaveBeenCalledWith("plain123", 10);
    expect(updateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 3 },
        data: expect.objectContaining({
          fullName: "Actualizado",
          passwordHash: "new-hash",
        }),
      }),
    );
  });

  it("PUT returns 500 for invalid payload", async () => {
    const response = await PUT(
      buildRequest({ institutionalEmail: "bad-email" }),
      context("3"),
    );
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload.error).toBeTypeOf("string");
  });

  it("DELETE removes member", async () => {
    deleteMock.mockResolvedValueOnce({ id: 3 });

    const response = await DELETE(new Request("http://localhost"), context("3"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.data.success).toBe(true);
    expect(deleteMock).toHaveBeenCalledWith({ where: { id: 3 } });
  });
});
