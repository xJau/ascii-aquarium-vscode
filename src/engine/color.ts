const PALETTE: Record<string, string> = {
  k: "#000000", K: "#555555",
  r: "#aa0000", R: "#ff5555",
  g: "#00aa00", G: "#55ff55",
  y: "#aa5500", Y: "#ffff55",
  b: "#0000aa", B: "#5555ff",
  m: "#aa00aa", M: "#ff55ff",
  c: "#00aaaa", C: "#55ffff",
  w: "#aaaaaa", W: "#ffffff",
};

/** Mask codes available to randColor for fish digit slots. */
const RAND_CODES = ["c", "C", "r", "R", "y", "Y", "b", "B", "g", "G", "m", "M"];

export function codeToCss(code: string): string {
  return PALETTE[code] ?? PALETTE.w;
}

/**
 * Replace each digit in a fish mask with a random palette code, consistently
 * per digit value within a single call. Eye code "4" always becomes "W".
 * Non-digit characters (letters, spaces, newlines) are preserved.
 */
export function randColor(mask: string, rng: () => number = Math.random): string {
  const assigned: Record<string, string> = {};
  let out = "";
  for (const ch of mask) {
    if (ch >= "1" && ch <= "9") {
      if (ch === "4") { out += "W"; continue; }
      if (!(ch in assigned)) {
        assigned[ch] = RAND_CODES[Math.floor(rng() * RAND_CODES.length)];
      }
      out += assigned[ch];
    } else {
      out += ch;
    }
  }
  return out;
}
