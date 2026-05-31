import { World, Entity } from "../../engine/types";

// Transcribed from add_ship in aq.pl
// Ships travel at the water surface (y=0, z=water_gap1)
// Direction: 0 = right (default facing), 1 = left

// Right-facing ship (goRight = true, dir=0 in Perl)
const SHIP_RIGHT_FRAME =
  "     |    |    |\n" +
  "    )_)  )_)  )_)\n" +
  "   )___))___))___)\\       \n" +
  "  )____)____)_____)\\\\     \n" +
  "_____|____|____|____\\\\\\\\__\n" +
  "\\                   /";

// Left-facing ship (dir=1 in Perl)
const SHIP_LEFT_FRAME =
  "         |    |    |\n" +
  "        (_(  (_(  (_(\n" +
  "      /(___((___((___(\n" +
  "    //(_____(____(____(   \n" +
  "__///____|____|____|_____\n" +
  "    \\                   /";

// Masks: y = yellow, w = white
const SHIP_RIGHT_MASK =
  "     y    y    y\n" +
  "\n" +
  "                  w\n" +
  "                   ww\n" +
  "yyyyyyyyyyyyyyyyyyyywwwyy\n" +
  "y                   y";

const SHIP_LEFT_MASK =
  "         y    y    y\n" +
  "\n" +
  "      w\n" +
  "    ww\n" +
  "yywwwyyyyyyyyyyyyyyyyyyyy\n" +
  "    y                   y";

export function addShip(world: World, rng: () => number = Math.random): Entity {
  const goRight = rng() < 0.5;
  const speed = 1;
  const frame = goRight ? SHIP_RIGHT_FRAME : SHIP_LEFT_FRAME;
  const mask = goRight ? SHIP_RIGHT_MASK : SHIP_LEFT_MASK;

  // Ship is ~24 cols wide
  const frameWidth = 24;
  const x = goRight ? -frameWidth : world.width;

  return world.add({
    name: "ship",
    type: "event",
    x,
    y: 0,
    z: 2,
    defaultColor: "W",
    dieOffscreen: true,
    shape: {
      frames: [frame],
      masks: [mask],
    },
    callback: (_e, dt) => ({ dx: (goRight ? 1 : -1) * speed * dt * 8 }),
  });
}
