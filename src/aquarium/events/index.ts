import { World, Entity } from "../../engine/types";
import { addShark } from "./shark";
import { addWhale } from "./whale";
import { addShip } from "./ship";
import { addBigFish } from "./bigFish";
import { addMonster } from "./monster";

export const EVENT_FACTORIES: Record<string, (w: World, rng?: () => number) => Entity> = {
  shark: addShark, whale: addWhale, ship: addShip, bigFish: addBigFish, monster: addMonster,
};

/** Spawn one event chosen uniformly from the enabled keys. */
export function scheduleEvent(world: World, enabled: string[], rng: () => number = Math.random): Entity | null {
  const keys = enabled.filter((k) => k in EVENT_FACTORIES);
  if (keys.length === 0) return null;
  const key = keys[Math.floor(rng() * keys.length)];
  return EVENT_FACTORIES[key](world, rng);
}
