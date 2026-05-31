import { World, Entity } from "../engine/types";

const FRAMES = [".", "o", "O", "O"];

export function addBubble(world: World, x: number, y: number, surfaceY: number): Entity {
  return world.add({
    name: "bubble",
    type: "bubble",
    x,
    y,
    z: 10,
    defaultColor: "C",
    physical: true,
    data: { t: 0, surfaceY },
    shape: { frames: FRAMES, masks: ["", "", "", ""] },
    callback: (e, dt) => {
      const d = e.data as { t: number; surfaceY: number };
      d.t += dt;
      const frame = Math.min(FRAMES.length - 1, Math.floor(d.t * 4));
      if (e.y <= d.surfaceY) { e.dead = true; return; }
      return { dy: -Math.max(1, Math.round(dt * 6)), frame };
    },
  });
}
