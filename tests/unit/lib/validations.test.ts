import { describe, expect, it } from "vitest";
import {
  createCompetencySchema,
  createLinkSchema,
  loginSchema,
} from "@/lib/validations";

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    const result = loginSchema.safeParse({
      email: "admin@unimayor.edu.co",
      password: "admin123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "admin",
      password: "admin123",
    });

    expect(result.success).toBe(false);
  });
});

describe("createCompetencySchema", () => {
  it("accepts valid competency payload", () => {
    const result = createCompetencySchema.safeParse({
      name: "Node.js",
      description: "Backend development",
      type: "TECHNICAL",
    });

    expect(result.success).toBe(true);
  });
});

describe("createLinkSchema", () => {
  it("rejects malformed URLs", () => {
    const result = createLinkSchema.safeParse({
      platform: "GitHub",
      url: "github.com/user",
    });

    expect(result.success).toBe(false);
  });
});
