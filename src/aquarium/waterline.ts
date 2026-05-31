import { World } from "../engine/types";
import { WATER_SEGMENTS } from "./sprites";

const WATER_DEPTHS = [2, 3, 4, 5]; // segment depths (front-most band nearest top)

export function addWaterline(world: World): void {
  for (let i = 0; i < WATER_SEGMENTS.length; i++) {
    const seg = WATER_SEGMENTS[i];
    const reps = Math.ceil(world.width / seg.length) + 1;
    const line = seg.repeat(reps);
    world.add({
      name: `water${i}`,
      type: "waterline",
      x: 0,
      y: i,
      z: WATER_DEPTHS[i],
      defaultColor: "c",
      shape: { frames: [line], masks: [""] },
    });
  }
}
