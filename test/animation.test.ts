import { describe, it, expect } from "vitest";
import { Animation } from "../src/engine/animation";
import { Grid } from "../src/engine/grid";

const dot = (over: any = {}) => ({
  name: "d", type: "d", x: 0, y: 0, z: 5,
  shape: { frames: ["o"], masks: ["r"] }, ...over,
});

describe("Animation", () => {
  it("applies callback movement on tick", () => {
    const a = new Animation(10, 10);
    const e = a.add(dot({ callback: () => ({ dx: 2, dy: 1 }) }));
    a.tick(1);
    expect(e.x).toBe(2);
    expect(e.y).toBe(1);
  });

  it("removes offscreen entities and fires deathCb", () => {
    const a = new Animation(10, 10);
    let respawned = false;
    a.add(dot({ x: 9, dieOffscreen: true, callback: () => ({ dx: 5 }),
      deathCb: () => { respawned = true; } }));
    a.tick(1);
    expect(a.entities().length).toBe(0);
    expect(respawned).toBe(true);
  });

  it("dieTime counts down and kills at <= 0", () => {
    const a = new Animation(10, 10);
    const e = a.add(dot({ dieTime: 1 }));
    a.tick(0.5);
    expect(e.dead).toBe(false);
    a.tick(0.6);
    expect(a.entities().length).toBe(0);
  });

  it("detects physical collisions via bbox overlap", () => {
    const a = new Animation(10, 10);
    const hits: string[] = [];
    a.add(dot({ name: "A", physical: true, x: 0, collisionCb: (_s, o) => hits.push(o.name) }));
    a.add(dot({ name: "B", physical: true, x: 0 }));
    a.tick(0);
    expect(hits).toContain("B");
  });

  it("paints back-to-front (low z drawn last, wins)", () => {
    const a = new Animation(3, 1);
    a.add(dot({ name: "back", z: 10, x: 0, shape: { frames: ["X"], masks: ["r"] } }));
    a.add(dot({ name: "front", z: 1, x: 0, shape: { frames: ["Y"], masks: ["g"] } }));
    const g = new Grid(3, 1);
    a.paint(g);
    expect(g.charAt(0, 0)).toBe("Y");
  });
});
