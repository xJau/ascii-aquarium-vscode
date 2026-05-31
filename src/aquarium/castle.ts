import { World } from "../engine/types";
import { CASTLE } from "./sprites";
import { frameDims } from "../engine/entity";

export function addCastle(world: World): void {
  const { height } = frameDims(CASTLE.frames[0]);
  world.add({
    name: "castle",
    type: "castle",
    x: 0, // bottom-left
    y: world.height - height,
    z: 22,
    defaultColor: "w",
    autoTrans: true,
    shape: CASTLE,
  });
}
