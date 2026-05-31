import { World, EntityShape } from "../engine/types";

/** Build a two-frame swaying seaweed strand of `height` rows. */
export function makeSeaweedShape(height: number, _rng: () => number): EntityShape {
  const left: string[] = [];
  const right: string[] = [];
  for (let row = 0; row < height; row++) {
    const leanLeft = row % 2 === 0;
    left.push(leanLeft ? "(" : " )");
    right.push(leanLeft ? " )" : "(");
  }
  return { frames: [left.join("\n"), right.join("\n")], masks: ["", ""] };
}

/** Add a single seaweed strand that respawns a fresh one when its life ends. */
export function addSeaweed(world: World, rng: () => number = Math.random): void {
  const height = 3 + Math.floor(rng() * 4); // 3..6
  const shape = makeSeaweedShape(height, rng);
  const x = Math.floor(rng() * world.width);
  const lifeSec = 8 * 60 + Math.floor(rng() * 4 * 60); // 8..12 min
  world.add({
    name: "seaweed",
    type: "seaweed",
    x,
    y: world.height - height,
    z: 21,
    defaultColor: "g",
    dieTime: lifeSec,
    data: { t: 0 },
    callback: (e, dt) => {
      const d = e.data as { t: number };
      d.t += dt;
      return { frame: Math.floor(d.t * 2) % 2 };
    },
    // respawn a replacement strand elsewhere so the tank never goes bare
    deathCb: (_e, w) => addSeaweed(w, rng),
    shape,
  });
}

export function addAllSeaweed(world: World, rng: () => number = Math.random): void {
  const count = Math.floor(world.width / 15);
  for (let i = 0; i < count; i++) addSeaweed(world, rng);
}
