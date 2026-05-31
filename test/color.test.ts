import { describe, it, expect } from "vitest";
import { codeToCss, randColor } from "../src/engine/color";

describe("color", () => {
  it("maps known mask codes to CSS colors", () => {
    expect(codeToCss("r")).toBe("#aa0000");
    expect(codeToCss("R")).toBe("#ff5555");
    expect(codeToCss("W")).toBe("#ffffff");
  });

  it("falls back to white for unknown codes", () => {
    expect(codeToCss("?")).toBe(codeToCss("w"));
  });

  it("randColor replaces digits with mask codes and eye(4)->W", () => {
    const rng = () => 0; // deterministic: always first palette entry
    const out = randColor("11\n4 ", rng);
    expect(out).not.toMatch(/[0-9]/);
    expect(out).toContain("W");
    expect(out).toBe("cc\nW ");
  });
});
