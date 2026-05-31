import { Animation } from "../engine/animation";
import { addWaterline } from "./waterline";
import { addCastle } from "./castle";
import { addAllSeaweed } from "./seaweed";
import { addFish, fishPoolSize } from "./fish";
import { scheduleEvent } from "./events";

export interface AquariumConfig {
  enabledEvents: string[];
  targetFps: number;
}

export class Aquarium {
  world: Animation;
  private cfg: AquariumConfig;
  private rng: () => number;
  private gap: number;

  constructor(cols: number, rows: number, cfg: AquariumConfig, rng: () => number = Math.random) {
    this.world = new Animation(cols, rows);
    this.cfg = cfg;
    this.rng = rng;
    this.gap = 10 + rng() * 20;
    this.build();
  }

  private build(): void {
    addWaterline(this.world);
    addCastle(this.world);
    addAllSeaweed(this.world, this.rng);
    addFish(this.world, fishPoolSize(this.world.width, this.world.height), this.rng);
  }

  update(dt: number): void {
    this.world.tick(dt);
    const eventActive = this.world.entities().some((e) => e.type === "event");
    if (!eventActive) {
      this.gap -= dt;
      if (this.gap <= 0) {
        scheduleEvent(this.world, this.cfg.enabledEvents, this.rng);
        this.gap = 10 + this.rng() * 20;
      }
    }
  }

  resize(cols: number, rows: number): void {
    this.world = new Animation(cols, rows);
    this.build();
  }
}
