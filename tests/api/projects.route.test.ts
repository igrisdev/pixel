import { beforeEach, describe, expect, it, vi } from "vitest";

const { findManyMock, createMock, ensureMemberExistsMock } = vi.hoisted(() => ({
  findManyMock: vi.fn(),
  createMock: vi.fn(),
  ensureMemberExistsMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    project: {
      findMany: findManyMock,
      create: createMock,
    },
  },
}));

vi.mock("@/lib/member-provision", () => ({
  ensureMemberExists: ensureMemberExistsMock,
}));

import { GET, POST } from "@/app/api/projects/route";

function makeProject(id: number) {
  return {
    id,
    title: `Proyecto ${id}`,
    objective: "Objetivo",
    awards: null,
    startDate: new Date("2026-01-01"),
    endDate: null,
    createdBy: 1,
    coverImageUrl: null,
    approvalStatus: "PENDING",
    products: [],
  };
}

function postRequest(body: unknown) {
  return new Request("http://localhost/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("/api/projects route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET returns project list", async () => {
    findManyMock.mockResolvedValueOnce([makeProject(1), makeProject(2)]);

    const response = await GET(new Request("http://localhost/api/projects"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.data).toHaveLength(2);
  });

  it("GET filters by createdBy when query param is present", async () => {
    findManyMock.mockResolvedValueOnce([makeProject(3)]);

    const response = await GET(
      new Request("http://localhost/api/projects?createdBy=8"),
    );

    expect(response.status).toBe(200);
    expect(findManyMock).toHaveBeenCalledWith(
      expect.objectContaining({ where: { createdBy: 8 } }),
    );
  });

  it("POST creates project with valid payload", async () => {
    ensureMemberExistsMock.mockResolvedValueOnce(undefined);
    createMock.mockResolvedValueOnce(makeProject(11));

    const response = await POST(
      postRequest({
        title: "Nuevo Proyecto",
        objective: "Objetivo de prueba",
        awards: "",
        startDate: "2026-01-01",
        endDate: "",
        coverImageUrl: "",
        createdBy: 1,
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.data.id).toBe(11);
    expect(ensureMemberExistsMock).toHaveBeenCalledWith(1);
  });

  it("POST returns 500 for invalid payload", async () => {
    const response = await POST(
      postRequest({
        title: "",
        objective: "",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload.error).toBeTypeOf("string");
  });
});
