import { beforeEach, describe, expect, it, vi } from "vitest";

const { updateMock, findUniqueMock } = vi.hoisted(() => ({
  updateMock: vi.fn(),
  findUniqueMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    member: {
      update: updateMock,
      findUnique: findUniqueMock,
    },
  },
}));

import { PUT } from "@/app/api/members/[id]/competencies/route";

function context(id: string) {
  return { params: Promise.resolve({ id }) };
}

function request(body: unknown) {
  return new Request("http://localhost/api/members/2/competencies", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("PUT /api/members/[id]/competencies", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates competency relations and returns mapped competencies", async () => {
    updateMock.mockResolvedValueOnce({});
    findUniqueMock.mockResolvedValueOnce({
      competencies: [
        { id: 1, name: "Node", description: "Backend", type: "TECHNICAL" },
      ],
    });

    const response = await PUT(request({ competencyIds: [1, 2] }), context("2"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(updateMock).toHaveBeenCalledWith({
      where: { id: 2 },
      data: { competencies: { set: [{ id: 1 }, { id: 2 }] } },
    });
    expect(payload.data).toEqual([
      { id: 1, name: "Node", description: "Backend", type: "TECHNICAL" },
    ]);
  });

  it("returns empty array when member is missing after update", async () => {
    updateMock.mockResolvedValueOnce({});
    findUniqueMock.mockResolvedValueOnce(null);

    const response = await PUT(request({ competencyIds: [] }), context("2"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.data).toEqual([]);
  });

  it("returns 500 for invalid payload", async () => {
    const response = await PUT(request({ competencyIds: ["bad"] }), context("2"));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload.error).toBeTypeOf("string");
  });
});
