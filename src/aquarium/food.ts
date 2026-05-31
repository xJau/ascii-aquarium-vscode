import { World, Entity } from "../engine/types";

export function addFood(world: World, x: number, y: number): Entity {
  return world.add({
    name: "food",
    type: "food",
    x, y, z: 4,
    defaultColor: "Y",
    physical: true,
    dieOffscreen: true,
    shape: { frames: ["."], masks: [""] },
    callback: () => ({ dy: 1 }), // sinks one cell per tick
    collisionCb: (self, other) => {
      if (other.type === "fish") self.dead = true; // eaten
    },
  });
}
