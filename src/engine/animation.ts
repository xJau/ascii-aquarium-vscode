import { Entity, EntitySpec, World } from "./types";
import { makeEntity, frameDims } from "./entity";
import { Grid } from "./grid";

export class Animation implements World {
  width: number;
  height: number;
  private list: Entity[] = [];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  add(spec: EntitySpec): Entity {
    const e = makeEntity(spec);
    this.list.push(e);
    return e;
  }

  remove(e: Entity): void {
    const i = this.list.indexOf(e);
    if (i >= 0) this.list.splice(i, 1);
  }

  entities(): Entity[] { return this.list; }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  private offscreen(e: Entity): boolean {
    return e.x + e.width < 0 || e.x > this.width || e.y + e.height < 0 || e.y > this.height;
  }

  private recomputeDims(e: Entity): void {
    const d = frameDims(e.shape.frames[e.frame] ?? "");
    e.width = d.width;
    e.height = d.height;
  }

  tick(dt: number): void {
    for (const e of this.list) {
      if (e.dead) continue;
      e.age += dt;
      if (e.callback) {
        const m = e.callback(e, dt) || {};
        if (m.dx) e.x += m.dx;
        if (m.dy) e.y += m.dy;
        if (m.frame !== undefined && m.frame !== e.frame) {
          e.frame = m.frame;
          this.recomputeDims(e);
        }
      }
      if (e.dieTime !== undefined) {
        e.dieTime -= dt;
        if (e.dieTime <= 0) e.dead = true;
      }
      if (e.dieFrame !== undefined && e.frame === e.dieFrame) e.dead = true;
      if (e.dieOffscreen && this.offscreen(e)) e.dead = true;
    }

    const dead = this.list.filter((e) => e.dead);
    for (const e of dead) { if (e.deathCb) e.deathCb(e, this); }
    if (dead.length) this.list = this.list.filter((e) => !e.dead);

    const phys = this.list.filter((e) => e.physical);
    for (let i = 0; i < phys.length; i++) {
      for (let j = i + 1; j < phys.length; j++) {
        if (this.overlap(phys[i], phys[j])) {
          phys[i].collisionCb?.(phys[i], phys[j], this);
          phys[j].collisionCb?.(phys[j], phys[i], this);
        }
      }
    }
  }

  private overlap(a: Entity, b: Entity): boolean {
    return (
      a.x < b.x + b.width && a.x + a.width > b.x &&
      a.y < b.y + b.height && a.y + a.height > b.y
    );
  }

  paint(grid: Grid): void {
    const ordered = [...this.list].sort((a, b) => b.z - a.z);
    for (const e of ordered) {
      const frame = e.shape.frames[e.frame] ?? "";
      const mask = e.shape.masks[e.frame] ?? "";
      grid.blit(frame, mask, e.x, e.y, {
        transparentChar: e.transparentChar!,
        autoTrans: e.autoTrans!,
        defaultColor: e.defaultColor!,
      });
    }
  }
}
