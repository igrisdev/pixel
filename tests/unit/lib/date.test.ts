import { describe, expect, it } from "vitest";
import { formatDate, formatDateShort, formatYear } from "@/lib/date";

describe("date format helpers", () => {
  it("returns dash when date is empty", () => {
    expect(formatDate(null)).toBe("-");
    expect(formatDateShort(undefined)).toBe("-");
    expect(formatYear(null)).toBe("-");
  });

  it("formats full year correctly", () => {
    expect(formatYear("2026-03-14")).toBe("2026");
  });

  it("returns localized long and short dates", () => {
    const longDate = formatDate("2026-03-14");
    const shortDate = formatDateShort("2026-03-14");

    expect(longDate).toContain("2026");
    expect(shortDate).toContain("2026");
  });
});
