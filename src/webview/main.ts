import { Aquarium } from "../aquarium/aquarium";
import { Grid } from "../engine/grid";
import { codeToCss } from "../engine/color";
import { addFood } from "../aquarium/food";

declare function acquireVsCodeApi(): { postMessage(m: unknown): void };

const tank = document.getElementById("tank") as HTMLPreElement;
let cols = 80, rows = 24, fps = 16, speed = 1, paused = false;
let feedEnabled = true;

function measure(): void {
  const probe = document.createElement("span");
  probe.textContent = "M"; probe.style.visibility = "hidden";
  tank.appendChild(probe);
  const cw = probe.getBoundingClientRect().width || 8;
  const lh = probe.getBoundingClientRect().height || 16;
  tank.removeChild(probe);
  cols = Math.max(20, Math.floor((window.innerWidth - 8) / cw));
  rows = Math.max(10, Math.floor((window.innerHeight - 8) / lh));
}

let aq: Aquarium;
function rebuild(): void {
  measure();
  aq = new Aquarium(cols, rows, { enabledEvents: (window as any).__events ?? [], targetFps: fps });
}

function render(): void {
  const g = new Grid(cols, rows);
  aq.world.paint(g);
  const lines: string[] = [];
  for (let y = 0; y < rows; y++) {
    let line = "", run = "", code = "";
    for (let x = 0; x < cols; x++) {
      const ch = g.charAt(x, y).replace(/&/g, "&amp;").replace(/</g, "&lt;");
      const c = g.codeAt(x, y);
      if (c !== code && run) { line += `<span style="color:${codeToCss(code)}">${run}</span>`; run = ""; }
      code = c; run += ch;
    }
    if (run) line += `<span style="color:${codeToCss(code)}">${run}</span>`;
    lines.push(line);
  }
  tank.innerHTML = lines.join("\n");
}

let last = 0, acc = 0;
function loop(now: number): void {
  // clamp dt so a backgrounded tab (rAF paused) doesn't dump a huge catch-up
  // burst into the accumulator and spiral / freeze on refocus.
  const dt = last ? Math.min(0.25, (now - last) / 1000) : 0;
  last = now;
  if (!paused) {
    acc += dt * speed;
    const step = 1 / fps;
    // Guard the whole step: a thrown error here would stop the rAF chain and
    // freeze the aquarium permanently. Log it and keep animating instead.
    try {
      while (acc >= step) { aq.update(step); acc -= step; }
      render();
    } catch (err) {
      console.error("aquarium update failed; skipping frame", err);
      acc = 0;
    }
  }
  requestAnimationFrame(loop);
}

tank.addEventListener("click", (ev) => {
  if (!feedEnabled) return;
  const rect = tank.getBoundingClientRect();
  const cx = Math.floor(((ev.clientX - rect.left) / rect.width) * cols);
  addFood(aq.world, cx, 5);
});

const $ = (id: string) => document.getElementById(id)!;
$("pause").addEventListener("click", () => { paused = !paused; });
$("slow").addEventListener("click", () => { speed = 0.5; });
$("normal").addEventListener("click", () => { speed = 1; });
$("fast").addEventListener("click", () => { speed = 2; });
$("restart").addEventListener("click", () => rebuild());

window.addEventListener("resize", () => { clearTimeout((window as any).__rt); (window as any).__rt = setTimeout(rebuild, 200); });

window.addEventListener("message", (e) => {
  const m = (e as MessageEvent).data;
  if (m.cmd === "config") { fps = m.fps ?? fps; feedEnabled = m.feedEnabled ?? feedEnabled; (window as any).__events = m.enabledEvents ?? []; rebuild(); }
  else if (m.cmd === "pause") paused = true;
  else if (m.cmd === "speed") speed = m.value;
  else if (m.cmd === "restart") rebuild();
});

rebuild();
requestAnimationFrame(loop);
