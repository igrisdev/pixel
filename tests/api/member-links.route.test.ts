import { beforeEach, describe, expect, it, vi } from "vitest";

const { createMock, updateMock, deleteMock } = vi.hoisted(() => ({
  createMock: vi.fn(),
  updateMock: vi.fn(),
  deleteMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    professionalLink: {
      create: createMock,
      update: updateMock,
      delete: deleteMock,
    },
  },
}));

import { DELETE, POST, PUT } from "@/app/api/members/[id]/links/route";

function context(id: string) {
  return { params: Promise.resolve({ id }) };
}

function req(method: "POST" | "PUT" | "DELETE", url: string, body?: unknown): Request {
  return new Request(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
}

describe("/api/members/[id]/links route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("POST creates a professional link", async () => {
    createMock.mockResolvedValueOnce({
      id: 11,
      platform: "GitHub",
      url: "https://github.com/member",
      memberId: 4,
    });

    const response = await POST(
      req("POST", "http://localhost/api/members/4/links", {
        platform: "GitHub",
        url: "https://github.com/member",
      }),
      context("4"),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.data.id).toBe(11);
    expect(createMock).toHaveBeenCalledWith({
      data: {
        platform: "GitHub",
        url: "https://github.com/member",
        memberId: 4,
      },
    });
  });

  it("DELETE returns 400 when linkId is missing", async () => {
    const response = await DELETE(
      req("DELETE", "http://localhost/api/members/4/links"),
      context("4"),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe("linkId es requerido");
  });

  it("DELETE removes link with linkId", async () => {
    deleteMock.mockResolvedValueOnce({ id: 11 });

    const response = await DELETE(
      req("DELETE", "http://localhost/api/members/4/links?linkId=11"),
      context("4"),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.data.success).toBe(true);
    expect(deleteMock).toHaveBeenCalledWith({
      where: { id: 11, memberId: 4 },
    });
  });

  it("PUT returns 400 when platform or url is missing", async () => {
    const response = await PUT(
      req("PUT", "http://localhost/api/members/4/links?linkId=11", {
        platform: "GitHub",
      }),
      context("4"),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe("Platform y URL son requeridos");
  });

  it("PUT updates link when payload is valid", async () => {
    updateMock.mockResolvedValueOnce({
      id: 11,
      platform: "LinkedIn",
      url: "https://linkedin.com/in/member",
      memberId: 4,
    });

    const response = await PUT(
      req("PUT", "http://localhost/api/members/4/links?linkId=11", {
        platform: "LinkedIn",
        url: "https://linkedin.com/in/member",
      }),
      context("4"),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.data.platform).toBe("LinkedIn");
    expect(updateMock).toHaveBeenCalledWith({
      where: { id: 11, memberId: 4 },
      data: {
        platform: "LinkedIn",
        url: "https://linkedin.com/in/member",
      },
    });
  });
});
