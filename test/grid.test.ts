import { describe, it, expect } from "vitest";
import { Grid } from "../src/engine/grid";

describe("Grid", () => {
  it("blits a sprite and respects transparent char", () => {
    const g = new Grid(5, 2);
    g.blit("ab\n?c", "rg\n?y", 0, 0, { transparentChar: "?", autoTrans: false, defaultColor: "w" });
    expect(g.charAt(0, 0)).toBe("a");
    expect(g.codeAt(0, 0)).toBe("r");
    expect(g.charAt(0, 1)).toBe(" ");
  });

  it("uses defaultColor where mask has a space", () => {
    const g = new Grid(3, 1);
    g.blit("xy", "r ", 0, 0, { transparentChar: "?", autoTrans: false, defaultColor: "b" });
    expect(g.codeAt(0, 0)).toBe("r");
    expect(g.codeAt(1, 0)).toBe("b");
  });

  it("clips sprites at grid bounds without throwing", () => {
    const g = new Grid(2, 1);
    expect(() => g.blit("abcd", "rrrr", 1, 0, { transparentChar: "?", autoTrans: false, defaultColor: "w" })).not.toThrow();
    expect(g.charAt(1, 0)).toBe("a");
  });

  it("autoTrans makes leading whitespace transparent", () => {
    const g = new Grid(4, 1);
    g.fillChar("x");
    g.blit("  z", "", 0, 0, { transparentChar: "?", autoTrans: true, defaultColor: "w" });
    expect(g.charAt(0, 0)).toBe("x");
    expect(g.charAt(2, 0)).toBe("z");
  });
});
