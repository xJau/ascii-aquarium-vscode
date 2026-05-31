import { World, Entity } from "../engine/types";
import { FISH } from "./sprites";
import { randColor } from "../engine/color";
import { addBubble } from "./bubbles";

const WATER_TOP = 5; // first row below the waterline band

export function fishPoolSize(cols: number, rows: number): number {
  return Math.floor((cols * rows) / 350);
}

export function spawnFish(world: World, rng: () => number = Math.random): Entity {
  const sprite = FISH[Math.floor(rng() * FISH.length)];
  const goRight = rng() < 0.5;
  const variant = goRight ? sprite.right : sprite.left;
  const speed = rng() * 2 + 0.25;
  const z = 3 + Math.floor(rng() * 18); // 3..20
  const mask = randColor(variant.masks[0], rng);
  const lines = variant.frames[0].split("\n");
  const h = lines.length;
  const w = Math.max(...lines.map((l) => l.length));
  const y = WATER_TOP + Math.floor(rng() * Math.max(1, world.height - WATER_TOP - h));
  const x = goRight ? -w : world.width;

  return world.add({
    name: "fish",
    type: "fish",
    x,
    y,
    z,
    dieOffscreen: true,
    physical: true, // so the shark can eat us and we can eat food
    defaultColor: "w",
    data: { speed, goRight },
    shape: { frames: [variant.frames[0]], masks: [mask] },
    callback: (e, dt) => {
      const d = e.data as { speed: number; goRight: boolean };
      if (rng() < 0.03) {
        const mouthX = d.goRight ? e.x + e.width : e.x;
        addBubble(world, Math.round(mouthX), Math.round(e.y + e.height / 2), WATER_TOP - 1);
      }
      // chase nearest food within 25 cells
      const foods = (world.entities() as Entity[]).filter((o) => o.type === "food");
      let target: Entity | undefined;
      let best = 25;
      for (const f of foods) {
        const dist = Math.abs(f.x - e.x) + Math.abs(f.y - e.y);
        if (dist < best) { best = dist; target = f; }
      }
      if (target) {
        const vx = Math.sign(target.x - e.x) * d.speed * dt * 10;
        const vy = Math.sign(target.y - e.y) * d.speed * dt * 4;
        return { dx: vx, dy: vy };
      }
      return { dx: (d.goRight ? 1 : -1) * d.speed * dt * 8 };
    },
    deathCb: (_e, w2) => { spawnFish(w2, rng); },
  });
}

export function addFish(world: World, count: number, rng: () => number = Math.random): void {
  for (let i = 0; i < count; i++) spawnFish(world, rng);
}
