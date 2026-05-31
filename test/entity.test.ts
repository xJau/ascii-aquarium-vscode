import { describe, it, expect } from "vitest";
import { makeEntity, frameDims } from "../src/engine/entity";

const shape = { frames: ["ab\ncd", "xy\nzw"], masks: ["rr\ngg", ""] };

describe("entity", () => {
  it("computes width/height from current frame", () => {
    const e = makeEntity({ name: "t", type: "t", x: 0, y: 0, z: 1, shape });
    expect(e.width).toBe(2);
    expect(e.height).toBe(2);
    expect(e.id).toBeGreaterThan(0);
  });

  it("frameDims handles ragged frames (max line length)", () => {
    expect(frameDims("a\nbcd")).toEqual({ width: 3, height: 2 });
  });

  it("does not throw when a mask is larger than its frame (oversize is harmless)", () => {
    const bad = { frames: ["ab"], masks: ["rrr"] };
    // An oversized mask must never crash entity creation — blit ignores the
    // extra cells. (makeEntity warns; we just assert it is non-fatal.)
    expect(() => makeEntity({ name: "b", type: "b", x: 0, y: 0, z: 1, shape: bad })).not.toThrow();
  });

  it("defaults transparentChar, autoTrans, defaultColor", () => {
    const e = makeEntity({ name: "t", type: "t", x: 0, y: 0, z: 1, shape });
    expect(e.transparentChar).toBe("?");
    expect(e.autoTrans).toBe(true);
    expect(e.defaultColor).toBe("w");
  });
});
