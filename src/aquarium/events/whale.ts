import { World, Entity } from "../../engine/types";

// Transcribed from add_whale in aq.pl
// The whale has a body and an animated water spout.
// Perl builds 5 no-spout frames then 7 spout frames = 12 total frames per dir.
// We reproduce the same structure.

// Whale body images (right-facing = dir 0, left-facing = dir 1)
const WHALE_BODY_RIGHT =
  "        .-----:\n" +
  "      .'       `.\n" +
  ",????/       (o) \\\n" +
  "\\`._/          ,__)";

const WHALE_BODY_LEFT =
  "    :-----.\n" +
  "  .'       `.\n" +
  " / (o)       \\????,\n" +
  "(__,          \\_.'/";

// Whale color mask (same mask used for all frames, only body)
// B = blue body, W = white eye detail
const WHALE_MASK_RIGHT =
  "             C C\n" +
  "           CCCCCCC\n" +
  "           C  C  C\n" +
  "        BBBBBBB\n" +
  "      BB       BB\n" +
  "B    B       BWB B\n" +
  "BBBBB          BBBB";

const WHALE_MASK_LEFT =
  "   C C\n" +
  " CCCCCCC\n" +
  " C  C  C\n" +
  "    BBBBBBB\n" +
  "  BB       BB\n" +
  " B BWB       B    B\n" +
  "BBBB          BBBBB";

// Water spout frames (7 frames total)
// When combined: spout is prepended/aligned above the whale body
const WATER_SPOUT_FRAMES = [
  "\n\n   :\n",
  "\n   :\n   :\n",
  "  . .\n  -:-\n   :\n",
  "  . .\n .-:-.\n   :\n",
  "  . .\n'.-:--.`\n'  :  '\n",
  "\n .- -.\n;  :  ;\n",
  "\n\n;     ;\n",
];

function buildWhaleFrames(
  bodyImage: string,
  whaleBodyLines: number,
  spoutAlign: number
): string[] {
  const frames: string[] = [];

  // 5 no-spout frames: 3 blank lines + body
  const noSpoutPrefix = "\n\n\n";
  for (let i = 0; i < 5; i++) {
    frames.push(noSpoutPrefix + bodyImage);
  }

  // 7 spout frames: aligned spout + body
  for (const spout of WATER_SPOUT_FRAMES) {
    // Align: prepend spoutAlign spaces to each line of spout
    const alignedSpout = spout
      .split("\n")
      .join("\n" + " ".repeat(spoutAlign));
    frames.push(alignedSpout + bodyImage);
  }

  return frames;
}

export function addWhale(world: World, rng: () => number = Math.random): Entity {
  const goRight = rng() < 0.5;
  const speed = 1;

  // dir 0 = right, spoutAlign=11; dir 1 = left, spoutAlign=1
  const spoutAlign = goRight ? 11 : 1;
  const bodyImage = goRight ? WHALE_BODY_RIGHT : WHALE_BODY_LEFT;
  const maskStr = goRight ? WHALE_MASK_RIGHT : WHALE_MASK_LEFT;

  const frames = buildWhaleFrames(bodyImage, 4, spoutAlign);

  // All frames share the same mask (mask covers the body region only)
  // Mask is shorter than the frame (body is at bottom, spout lines above)
  // Per spec: masks: [""] for frames with no per-frame mask is fine,
  // but we have one mask for the body. Since mask validation checks that
  // mask lines <= frame lines and mask cols <= frame cols per row,
  // we use "" for all frames to avoid any alignment issues.
  const masks = frames.map(() => "");

  // Whale body ~18 cols wide (right variant), 20 (left)
  const frameWidth = goRight ? 18 : 20;
  const x = goRight ? -frameWidth : world.width;

  const numFrames = frames.length;

  return world.add({
    name: "whale",
    type: "event",
    x,
    y: 0,
    z: 3,
    defaultColor: "B",
    dieOffscreen: true,
    shape: {
      frames,
      masks,
    },
    callback: (e, dt) => ({
      dx: (goRight ? 1 : -1) * speed * dt * 8,
      frame: Math.floor(e.age * 1.5) % numFrames,
    }),
  });
}
