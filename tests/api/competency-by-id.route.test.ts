import { beforeEach, describe, expect, it, vi } from "vitest";

const { findUniqueMock, updateMock, deleteMock } = vi.hoisted(() => ({
  findUniqueMock: vi.fn(),
  updateMock: vi.fn(),
  deleteMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    competency: {
      findUnique: findUniqueMock,
      update: updateMock,
      delete: deleteMock,
    },
  },
}));

import { DELETE, GET, PUT } from "@/app/api/competencies/[id]/route";

function context(id: string) {
  return { params: Promise.resolve({ id }) };
}

function putRequest(body: unknown): Request {
  return new Request("http://localhost/api/competencies/3", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("/api/competencies/[id] route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET returns 404 when competency does not exist", async () => {
    findUniqueMock.mockResolvedValueOnce(null);

    const response = await GET(new Request("http://localhost"), context("3"));
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload.error).toBe("Competencia no encontrada");
  });

  it("GET returns competency when found", async () => {
    findUniqueMock.mockResolvedValueOnce({
      id: 3,
      name: "TypeScript",
      description: "Typing",
      type: "TECHNICAL",
    });

    const response = await GET(new Request("http://localhost"), context("3"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.data.name).toBe("TypeScript");
  });

  it("PUT updates competency with valid payload", async () => {
    updateMock.mockResolvedValueOnce({
      id: 3,
      name: "Liderazgo",
      description: "Gestión de equipos",
      type: "SOFT",
    });

    const response = await PUT(
      putRequest({
        name: "Liderazgo",
        description: "Gestión de equipos",
        type: "SOFT",
      }),
      context("3"),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.data.type).toBe("SOFT");
    expect(updateMock).toHaveBeenCalledWith({
      where: { id: 3 },
      data: {
        name: "Liderazgo",
        description: "Gestión de equipos",
        type: "SOFT",
      },
    });
  });

  it("PUT returns 500 for invalid payload", async () => {
    const response = await PUT(
      putRequest({ name: "", type: "INVALID" }),
      context("3"),
    );
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload.error).toBeTypeOf("string");
  });

  it("DELETE removes competency", async () => {
    deleteMock.mockResolvedValueOnce({ id: 3 });

    const response = await DELETE(new Request("http://localhost"), context("3"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.data.success).toBe(true);
    expect(deleteMock).toHaveBeenCalledWith({ where: { id: 3 } });
  });
});
