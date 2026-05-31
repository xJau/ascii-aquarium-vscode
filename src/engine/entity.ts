import { Entity, EntitySpec } from "./types";

let nextId = 1;

export function frameDims(frame: string): { width: number; height: number } {
  const lines = frame.split("\n");
  let width = 0;
  for (const l of lines) width = Math.max(width, l.length);
  return { width, height: lines.length };
}

export function makeEntity(spec: EntitySpec): Entity {
  const frame = spec.frame ?? 0;
  const f = spec.shape.frames[frame] ?? "";
  // Sanity-check masks. An oversized mask is a transcription artifact, but it is
  // HARMLESS at render time — blit only reads mask cells that line up with an
  // existing frame char, so extra mask rows/columns are simply never used. We
  // therefore warn instead of throwing: a slightly-misaligned color mask must
  // never crash the animation loop (which would freeze the whole aquarium).
  spec.shape.frames.forEach((fr, i) => {
    const m = spec.shape.masks[i];
    if (!m) return;
    const fl = fr.split("\n");
    const ml = m.split("\n");
    if (ml.length > fl.length) {
      console.warn(`mask taller than frame in ${spec.name} (ignored)`);
    }
    ml.forEach((line, r) => {
      if (line.length > (fl[r]?.length ?? 0)) {
        console.warn(`mask wider than frame row ${r} in ${spec.name} (ignored)`);
      }
    });
  });
  const { width, height } = frameDims(f);
  return {
    ...spec,
    frame,
    transparentChar: spec.transparentChar ?? "?",
    autoTrans: spec.autoTrans ?? true,
    defaultColor: spec.defaultColor ?? "w",
    data: spec.data ?? {},
    id: nextId++,
    age: 0,
    dead: false,
    width,
    height,
  };
}
