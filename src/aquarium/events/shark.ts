import { World, Entity } from "../../engine/types";

// Transcribed from add_shark in aq.pl
// q{} escaping: \\ -> \, \} -> }, \{ -> {, ? = transparent char
// Leading blank line after q{ is dropped per spec

const SHARK_RIGHT_FRAME =
  "                              __\n" +
  "                             ( `\\\n" +
  "  ,??????????????????????????)   `\\\n" +
  ";' `.????????????????????????(     `\\__\n" +
  " ;   `.?????????????__..---''          `~~~~-._\n" +
  "  `.   `.____...--''                       (b  `--._\n" +
  "    >                     _.-'      .((      ._     )\n" +
  "  .`.-`--...__         .-'     -.___.....-(|/|/|/|/'\n" +
  " ;.'?????????`. ...----`.___.',,,_______......---'\n" +
  " '???????????'-'";

const SHARK_LEFT_FRAME =
  "                     __\n" +
  "                    /' )\n" +
  "                  /'   (??????????????????????????,\n" +
  "              __/'     )????????????????????????.' `;\n" +
  "      _.-~~~~'          ``---..__?????????????.'   ;\n" +
  " _.--'  b)                       ``--...____.'   .'\n" +
  "(     _.      )).      `-._                     <\n" +
  " `\\|\\|\\|\\|)-.....___.-     `-.         __...--'-.'-.\n" +
  "   `---......_______,,,`.___.'----... .'?????????`-;\n" +
  "                                     `-`???????????`";

// Masks: c = cyan, R = bright-red, W = bright-white
// Only a few colored cells; rest empty (treated as defaultColor)
const SHARK_RIGHT_MASK =
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "                                           cR\n" +
  " \n" +
  "                                          cWWWWWWWW\n" +
  "\n" +
  "";

const SHARK_LEFT_MASK =
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "        Rc\n" +
  "\n" +
  "  WWWWWWWWc\n" +
  "\n" +
  "";

export function addShark(world: World, rng: () => number = Math.random): Entity {
  const goRight = rng() < 0.5;
  const speed = 2;
  const frame = goRight ? SHARK_RIGHT_FRAME : SHARK_LEFT_FRAME;
  const mask = goRight ? SHARK_RIGHT_MASK : SHARK_LEFT_MASK;

  // Shark frame width: right ~53 cols, left ~53 cols
  const frameWidth = goRight ? 53 : 53;
  const x = goRight ? -frameWidth : world.width;
  const y = Math.floor(rng() * Math.max(1, world.height - 19)) + 9;

  return world.add({
    name: "shark",
    type: "event",
    x,
    y,
    z: 5,
    defaultColor: "C",
    physical: true,
    dieOffscreen: true,
    shape: {
      frames: [frame],
      masks: [mask],
    },
    callback: (_e, dt) => ({ dx: (goRight ? 1 : -1) * speed * dt * 8 }),
    collisionCb: (_self, other) => {
      if (other.type === "fish") other.dead = true;
    },
  });
}
