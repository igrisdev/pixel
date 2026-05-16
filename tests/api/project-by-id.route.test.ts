import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  projectFindUniqueMock,
  projectUpdateMock,
  projectDeleteMock,
  transactionMock,
} = vi.hoisted(() => ({
  projectFindUniqueMock: vi.fn(),
  projectUpdateMock: vi.fn(),
  projectDeleteMock: vi.fn(),
  transactionMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    project: {
      findUnique: projectFindUniqueMock,
      update: projectUpdateMock,
      delete: projectDeleteMock,
    },
    $transaction: transactionMock,
    academicProduct: {
      findMany: vi.fn(),
      deleteMany: vi.fn(),
      upsert: vi.fn(),
      create: vi.fn(),
    },
    participation: {
      findMany: vi.fn(),
      deleteMany: vi.fn(),
      upsert: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("@/lib/member-provision", () => ({
  ensureMemberExists: vi.fn(),
}));

import { DELETE, GET, PUT } from "@/app/api/projects/[id]/route";

function context(id: string) {
  return { params: Promise.resolve({ id }) };
}

function buildProject(id: number) {
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

function putRequest(body: unknown) {
  return new Request("http://localhost/api/projects/4", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("/api/projects/[id] route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    transactionMock.mockImplementation(async (cb: () => Promise<void>) => cb());
  });

  it("GET returns 404 when project does not exist", async () => {
    projectFindUniqueMock.mockResolvedValueOnce(null);

    const response = await GET(new Request("http://localhost"), context("4"));
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload.error).toBe("Proyecto no encontrado");
  });

  it("GET returns project data when found", async () => {
    projectFindUniqueMock.mockResolvedValueOnce(buildProject(4));

    const response = await GET(new Request("http://localhost"), context("4"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.data.id).toBe(4);
  });

  it("PUT updates project and returns updated data", async () => {
    projectUpdateMock.mockResolvedValueOnce(buildProject(4));
    projectFindUniqueMock.mockResolvedValueOnce(buildProject(4));

    const response = await PUT(
      putRequest({
        title: "Proyecto actualizado",
        objective: "Nuevo objetivo",
        awards: "",
        startDate: "2026-01-01",
        endDate: "",
        coverImageUrl: "",
        approvalStatus: "PENDING",
      }),
      context("4"),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.data.id).toBe(4);
    expect(projectUpdateMock).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 4 } }),
    );
  });

  it("DELETE removes project", async () => {
    projectDeleteMock.mockResolvedValueOnce({ id: 4 });

    const response = await DELETE(new Request("http://localhost"), context("4"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.data.success).toBe(true);
  });
});
