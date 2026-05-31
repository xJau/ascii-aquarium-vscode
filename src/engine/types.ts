export type Vec = { x: number; y: number };

/** Result a movement callback returns each tick. All fields optional. */
export interface Move {
  dx?: number;   // cells to move on x this tick (already scaled by caller's dt)
  dy?: number;
  frame?: number; // absolute frame index to switch to
}

export interface EntityShape {
  /** One or more frames; each frame is a block of text lines. */
  frames: string[];
  /** Color mask per frame, same line/col layout as frames; "" => use defaultColor. */
  masks: string[];
}

export interface EntitySpec {
  name: string;
  type: string;
  x: number;
  y: number;
  z: number;                 // depth: lower = nearer front
  shape: EntityShape;
  defaultColor?: string;     // single mask code char, default "w"
  frame?: number;            // starting frame index
  /** Char in a frame treated as transparent (Perl uses "?"). Default "?". */
  transparentChar?: string;
  /** Treat leading whitespace on each line as transparent. Default true. */
  autoTrans?: boolean;
  physical?: boolean;
  dieOffscreen?: boolean;
  dieTime?: number;          // seconds of life remaining; counts down
  dieFrame?: number;         // die when current frame index reaches this
  /** Movement callback; receives entity + dt seconds. */
  callback?: (e: Entity, dt: number) => Move | void;
  /** Called when the entity dies; may add replacements to the world. */
  deathCb?: (e: Entity, world: World) => void;
  /** Collision handler; called once per overlapping physical entity. */
  collisionCb?: (self: Entity, other: Entity, world: World) => void;
  /** Arbitrary per-entity state for callbacks. */
  data?: Record<string, unknown>;
}

// Forward declarations resolved by entity.ts / animation.ts.
export interface Entity extends EntitySpec {
  id: number;
  frame: number;   // current frame index (always resolved by makeEntity)
  age: number;     // seconds alive
  dead: boolean;
  width: number;   // computed from current frame
  height: number;
}

export interface World {
  width: number;
  height: number;
  add(spec: EntitySpec): Entity;
  remove(e: Entity): void;
  entities(): Entity[];
}
