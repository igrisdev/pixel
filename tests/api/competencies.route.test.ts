import { beforeEach, describe, expect, it, vi } from "vitest";

const { findManyMock, createMock } = vi.hoisted(() => ({
  findManyMock: vi.fn(),
  createMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    competency: {
      findMany: findManyMock,
      create: createMock,
    },
  },
}));

import { GET, POST } from "@/app/api/competencies/route";

function postRequest(body: unknown): Request {
  return new Request("http://localhost/api/competencies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("/api/competencies route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET returns mapped competencies", async () => {
    findManyMock.mockResolvedValueOnce([
      { id: 1, name: "Node.js", description: "Backend", type: "TECHNICAL" },
    ]);

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.data).toEqual([
      { id: 1, name: "Node.js", description: "Backend", type: "TECHNICAL" },
    ]);
  });

  it("GET returns 500 when prisma fails", async () => {
    findManyMock.mockRejectedValueOnce(new Error("db error"));

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload.error).toBeTypeOf("string");
  });

  it("POST creates competency with valid payload", async () => {
    createMock.mockResolvedValueOnce({
      id: 10,
      name: "Comunicación",
      description: "Habilidad blanda",
      type: "SOFT",
    });

    const response = await POST(
      postRequest({
        name: "Comunicación",
        description: "Habilidad blanda",
        type: "SOFT",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.data.id).toBe(10);
    expect(createMock).toHaveBeenCalledWith({
      data: {
        name: "Comunicación",
        description: "Habilidad blanda",
        type: "SOFT",
      },
    });
  });

  it("POST returns 500 for invalid payload", async () => {
    const response = await POST(
      postRequest({
        name: "",
        type: "INVALID",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload.error).toBeTypeOf("string");
  });
});
