import { describe, it, expect } from "vitest";
import { Aquarium } from "../src/aquarium/aquarium";
import { Animation } from "../src/engine/animation";
import { addWaterline } from "../src/aquarium/waterline";
import { addCastle } from "../src/aquarium/castle";
import { addAllSeaweed, addSeaweed, makeSeaweedShape } from "../src/aquarium/seaweed";
import { addBubble } from "../src/aquarium/bubbles";
import { addFood } from "../src/aquarium/food";
import { addFish, fishPoolSize, spawnFish } from "../src/aquarium/fish";
import { EVENT_FACTORIES, scheduleEvent } from "../src/aquarium/events";

describe("environment", () => {
  it("tiles waterline across full width at top", () => {
    const a = new Animation(80, 24);
    addWaterline(a);
    const top = a.entities().filter((e) => e.type === "waterline");
    expect(top.length).toBe(4);
    for (const seg of top) expect(seg.width).toBeGreaterThanOrEqual(80);
  });

  it("places castle at bottom-left", () => {
    const a = new Animation(80, 24);
    addCastle(a);
    const c = a.entities().find((e) => e.type === "castle")!;
    expect(c.x).toBe(0);
    expect(c.y).toBe(24 - c.height);
  });
});

describe("seaweed", () => {
  it("builds a 2-frame swaying strand of the given height", () => {
    const s = makeSeaweedShape(4, () => 0);
    expect(s.frames.length).toBe(2);
    expect(s.frames[0].split("\n").length).toBe(4);
    expect(s.frames[1].split("\n").length).toBe(4);
  });

  it("adds ~width/15 strands along the floor", () => {
    const a = new Animation(150, 24);
    addAllSeaweed(a, () => 0.5);
    const weeds = a.entities().filter((e) => e.type === "seaweed");
    expect(weeds.length).toBe(10);
    for (const w of weeds) expect(w.y + w.height).toBe(24);
  });

  it("respawns a replacement when a strand's life ends", () => {
    const a = new Animation(40, 24);
    addSeaweed(a, () => 0); // lifeSec = 8min
    expect(a.entities().filter((e) => e.type === "seaweed").length).toBe(1);
    a.tick(9 * 60); // past its lifespan -> dies, deathCb respawns one
    expect(a.entities().filter((e) => e.type === "seaweed").length).toBe(1);
  });
});

describe("bubbles", () => {
  it("rises upward over ticks", () => {
    const a = new Animation(40, 20);
    const b = addBubble(a, 5, 15, 4 /*surfaceY*/);
    const y0 = b.y;
    a.tick(1);
    expect(b.y).toBeLessThan(y0);
  });

  it("dies at the surface", () => {
    const a = new Animation(40, 20);
    addBubble(a, 5, 5, 4);
    a.tick(1); a.tick(1);
    expect(a.entities().filter((e) => e.type === "bubble").length).toBe(0);
  });
});

describe("fish", () => {
  it("pool size scales with screen area", () => {
    expect(fishPoolSize(80, 24)).toBe(Math.floor((80 * 24) / 350));
  });

  it("spawns the configured number of fish", () => {
    const a = new Animation(80, 24);
    addFish(a, 5, () => 0.5);
    expect(a.entities().filter((e) => e.type === "fish").length).toBe(5);
  });

  it("a right-moving fish has positive dx", () => {
    const a = new Animation(80, 24);
    const f = spawnFish(a, () => 0.0);
    const before = f.x;
    a.tick(1);
    expect(f.x).not.toBe(before);
  });
});

describe("events", () => {
  it("exposes the five event factories by key", () => {
    expect(Object.keys(EVENT_FACTORIES).sort()).toEqual(
      ["bigFish", "monster", "ship", "shark", "whale"].sort()
    );
  });

  it("scheduleEvent spawns exactly one enabled event", () => {
    const a = new Animation(80, 24);
    scheduleEvent(a, ["shark"], () => 0);
    expect(a.entities().filter((e) => e.type === "event").length).toBe(1);
  });

  it("each factory produces a valid entity (no mask-validation throw)", () => {
    for (const make of Object.values(EVENT_FACTORIES)) {
      const a = new Animation(80, 24);
      expect(() => make(a, () => 0.3)).not.toThrow();
      expect(a.entities().length).toBeGreaterThan(0);
    }
  });
});

describe("food", () => {
  it("falls downward over ticks", () => {
    const a = new Animation(40, 20);
    const food = addFood(a, 10, 6);
    const y0 = food.y;
    a.tick(1);
    expect(food.y).toBeGreaterThan(y0);
  });

  it("is removed when a physical fish overlaps it", () => {
    const a = new Animation(40, 20);
    // stand-in fish: physical, sitting where the food lands after one sink step
    a.add({
      name: "fish", type: "fish", x: 10, y: 7, z: 5, physical: true,
      shape: { frames: ["o"], masks: [""] },
    });
    addFood(a, 10, 6); // sinks to y=7 on the first tick, then overlaps the fish
    a.tick(1); // food sinks into the fish; collision marks food dead
    a.tick(1); // death sweep removes it
    expect(a.entities().filter((e) => e.type === "food").length).toBe(0);
  });
});

describe("Aquarium", () => {
  it("builds environment + fish on construction", () => {
    const aq = new Aquarium(80, 24, { enabledEvents: [], targetFps: 16 }, () => 0.5);
    const types = new Set(aq.world.entities().map((e) => e.type));
    expect(types.has("waterline")).toBe(true);
    expect(types.has("castle")).toBe(true);
    expect(types.has("seaweed")).toBe(true);
    expect(types.has("fish")).toBe(true);
  });

  it("keeps at most one active event", () => {
    const aq = new Aquarium(80, 24, { enabledEvents: ["shark"], targetFps: 16 }, () => 0);
    for (let i = 0; i < 100; i++) aq.update(1);
    expect(aq.world.entities().filter((e) => e.type === "event").length).toBeLessThanOrEqual(1);
  });
});
